package com.project.Shopapp.models;
import jakarta.persistence.*;
import lombok.*;

@Data
@Entity
@Table(name = "notifications")
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Builder
public class Notification extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Account user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(length = 50)
    private String type;

    @Column(name = "is_read")
    private Boolean isRead = false;
}
