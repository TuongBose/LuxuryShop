package com.project.Shopapp.services.notification;

import com.project.Shopapp.models.Notification;
import com.project.Shopapp.responses.notification.NotificationResponse;

import java.util.List;

public interface INotificationService {
    List<NotificationResponse> getNotificationByUserId(int userId) throws Exception;

    NotificationResponse markAsReadNotification(int userId, int notificationId) throws Exception;
    void  markAllAsReadNotification(int userId) throws Exception;

    List<NotificationResponse> getUnreadNotificationsByUserId(int userId) throws Exception;

    void deleteNoitificationById(int userId, int notificationId) throws Exception;
}
