package com.project.Shopapp.controllers;

import com.project.Shopapp.components.LocalizationUtils;
import com.project.Shopapp.models.Account;
import com.project.Shopapp.responses.ResponseObject;
import com.project.Shopapp.responses.notification.NotificationResponse;
import com.project.Shopapp.services.notification.NotificationService;
import com.project.Shopapp.utils.MessageKeys;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("${api.prefix}/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final LocalizationUtils localizationUtils;
    private final NotificationService notificationService;

    @GetMapping("")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ResponseObject> getNotificationByUserId() throws Exception {
        Account loginAccount = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = loginAccount.getUSERID();
        List<NotificationResponse> notificationResponses = notificationService.getNotificationByUserId(userId);
        return ResponseEntity.ok(ResponseObject.builder()
                .message(localizationUtils.getLocalizedMessage(
                        MessageKeys.NOTIFICATION_FETCHED_SUCCESSFULLY, userId))
                .status(HttpStatus.OK)
                .data(notificationResponses)
                .build());
    }

    @PatchMapping("mark-as-read/{notificationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ResponseObject> markAsReadNotification(@PathVariable int notificationId) throws Exception {
        Account loginAccount = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = loginAccount.getUSERID();
        NotificationResponse notificationResponses = notificationService.markAsReadNotification(userId, notificationId);
        return ResponseEntity.ok(ResponseObject.builder()
                .message(localizationUtils.getLocalizedMessage(
                        MessageKeys.NOTIFICATION_MARK_SUCCESS, notificationId))
                .status(HttpStatus.OK)
                .data(notificationResponses)
                .build());

    }

    @GetMapping("/unread")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ResponseObject> getUnreadNotifications() throws Exception{
        Account loginAccount = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = loginAccount.getUSERID();
        List<NotificationResponse> unreadNotifications = notificationService.getUnreadNotificationsByUserId(userId);
        return ResponseEntity.ok(ResponseObject.builder()
                .message(localizationUtils.getLocalizedMessage(
                        MessageKeys.UNREAD_NOTIFICATION_FETCHED_SUCCESSFULLY, userId))
                .status(HttpStatus.OK)
                .data(unreadNotifications)
                .build());
    }

    @DeleteMapping("/delete/{notificationId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ResponseObject> deleteNotificationById(@PathVariable int notificationId) throws Exception{
        Account loginAccount = (Account) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        int userId = loginAccount.getUSERID();
        notificationService.deleteNoitificationById(userId, notificationId);
        return ResponseEntity.ok(ResponseObject.builder()
                .message(localizationUtils.getLocalizedMessage(
                        MessageKeys.NOTIFICATION_DELETE_SUCCESS, notificationId))
                .status(HttpStatus.OK)
                .data(null)
                .build());
    }
}
