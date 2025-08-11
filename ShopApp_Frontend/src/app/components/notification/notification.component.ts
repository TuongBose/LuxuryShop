import { Component, DOCUMENT, inject, OnInit } from "@angular/core";
import { AccountResponse } from "../../responses/account/account.response";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { subscribe } from "diagnostics_channel";
import { ToastService } from "../../services/toast.service";
import { LoaiSanPhamService } from "../../services/loaisanpham.service";
import { SanPhamService } from "../../services/sanpham.service";
import { TokenService } from "../../services/token.service";
import { AccountService } from "../../services/account.service";
import { CartService } from "../../services/cart.service";
import { CouponService } from "../../services/coupon.service";
import { DonHangService } from "../../services/donhang.service";
import { PaymentService } from "../../services/payment.service";
import { AuthService } from "../../services/auth.service";
import { FeedbackService } from "../../services/feedback.service";
import { NotificationService } from "../../services/notification.service";
import { NotificationResponse } from "../../responses/notification.response";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { BaseComponent } from "../base/base.component";

@Component({
  selector: 'app-notification',
  standalone: true,
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css',
  imports: [
    CommonModule,
    HeaderComponent,
    FooterComponent
  ]
})

export class NotificationComponent extends BaseComponent implements OnInit {
  notifications: NotificationResponse[] = [];
  account?: number | null;

  ngOnInit(): void {
    debugger
    this.account = this.accountService.getAccountFromLocalStorage()?.userid;
    if (this.account) {
      this.loadNotifications();
    }
  }

  // Tải danh sách thông báo
  private loadNotifications(): void {
    debugger
    if (this.account) {
      this.notificationService.getUnreadNotifications().subscribe({
        next: (data: any) => {
          debugger
          this.notifications = (data.data as NotificationResponse[]).filter(notification => !notification.is_read);
        },
        error: (err) => {
          console.error('Lỗi khi tải thông báo:', err);
        }
      });
    }
  }

  // Đánh dấu thông báo là đã đọc
  markAsRead(notificationId: number): void {
    debugger
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        debugger
        this.notifications = this.notifications.map(notification =>
          notification.notification_id === notificationId ? { ...notification, isRead: true } : notification
        );
        this.loadNotifications();
        this.toastService.showToast({
          defaultMsg: 'Đã đánh dấu đọc',
          title: 'Thông báo',
          delay: 3000,
          type: 'success'
        });
      },
      error: (err) => {
        console.error('Lỗi khi đánh dấu thông báo là đã đọc:', err);
      }
    });
  }
}