package com.project.Shopapp.services.notification;

import com.project.Shopapp.components.LocalizationUtils;
import com.project.Shopapp.exceptions.DataNotFoundException;
import com.project.Shopapp.models.Account;
import com.project.Shopapp.models.Notification;
import com.project.Shopapp.repositories.AccountRepository;
import com.project.Shopapp.repositories.NotificationRepository;
import com.project.Shopapp.responses.notification.NotificationResponse;
import com.project.Shopapp.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
    private final LocalizationUtils localizationUtils;
    private final AccountRepository accountRepository;
    private final NotificationRepository notificationRepository;

    @Override
    public List<NotificationResponse> getNotificationByUserId(int userId) throws Exception {
        Account existingAccount = accountRepository.findById(userId).orElseThrow(
                () -> new DataNotFoundException(localizationUtils.getLocalizedMessage(MessageKeys.USER_NOT_FOUND))
        );
        return notificationRepository.findByUserOrderByNGAYTAODesc(existingAccount).stream()
                .map(NotificationResponse::fromNotification)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public NotificationResponse markAsReadNotification(int userId, int notificationId) throws Exception {
        Notification notification = notificationRepository.findById(notificationId).orElseThrow(()
                -> new DataNotFoundException(
                localizationUtils.getLocalizedMessage(MessageKeys.NOTIFICATION_NOT_FOUND, notificationId))
        );
        if (notification.getUser().getUSERID() != userId) {
            throw new DataNotFoundException(
                    localizationUtils.getLocalizedMessage(MessageKeys.NOTIFICATION_ACCESS_DENIED));
        }
        notification.setIsRead(true);
        notificationRepository.save(notification);
        return NotificationResponse.fromNotification(notification);
    }

    @Override
    public void markAllAsReadNotification(int userId) throws Exception {
        Account existingAccount = accountRepository.findById(userId).orElseThrow(
                () -> new DataNotFoundException(localizationUtils.getLocalizedMessage(MessageKeys.USER_NOT_FOUND))
        );
        List<Notification> notifications = notificationRepository.findByUser(existingAccount);
        for (Notification notification : notifications) {
            notification.setIsRead(true);
        }
        notificationRepository.saveAll(notifications);
    }

    @Override
    public List<NotificationResponse> getUnreadNotificationsByUserId(int userId) throws Exception{
        Account existingAccount = accountRepository.findById(userId).orElseThrow(
                () -> new DataNotFoundException(localizationUtils.getLocalizedMessage(MessageKeys.USER_NOT_FOUND))
        );
        return notificationRepository.findByUserAndIsReadFalseOrderByNGAYTAODesc(existingAccount).stream()
                .map(NotificationResponse::fromNotification)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteNoitificationById(int userId, int notificationId) throws Exception {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new DataNotFoundException(localizationUtils.getLocalizedMessage(
                        MessageKeys.NOTIFICATION_NOT_FOUND, notificationId)));
        if (notification.getUser().getUSERID() != userId) {
            throw new DataNotFoundException(
                    localizationUtils.getLocalizedMessage(MessageKeys.NOTIFICATION_DELETE_FORBIDDEN));
        }
        notificationRepository.delete(notification);
    }
}
