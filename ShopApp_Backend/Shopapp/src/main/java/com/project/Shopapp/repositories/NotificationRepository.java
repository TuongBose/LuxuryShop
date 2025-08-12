package com.project.Shopapp.repositories;

import com.project.Shopapp.models.Account;
import com.project.Shopapp.models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
    List<Notification> findByUserOrderByNGAYTAODesc(Account account);

    @Query(value = "SELECT COUNT(*) FROM notifications WHERE user_id = :userId AND is_read = false", nativeQuery = true)
    Long countNotificationItems (@Param("userId") int userId);

    List<Notification> findByUserAndIsReadFalseOrderByNGAYTAODesc(Account account);
    List<Notification> findByUser(Account account);
}
