package com.project.Shopapp.responses.notification;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.Shopapp.models.Notification;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponse {
    @JsonProperty("notification_id")
    private int id;

    @JsonProperty("user_id")
    private int userId;

    private String title;
    private String content;
    private String type;

    @JsonProperty("is_read")
    private Boolean isRead;

    @JsonProperty("create_at")
    private LocalDateTime createAt;

    public static NotificationResponse fromNotification (Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .userId(notification.getUser().getUSERID())
                .title(notification.getTitle())
                .content(notification.getContent())
                .type(notification.getType())
                .isRead(notification.getIsRead())
                .createAt(notification.getNGAYTAO())
                .build();
    }
}
