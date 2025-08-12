import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../services/account.service';
import { AccountResponse } from '../../responses/account/account.response';
import { TokenService } from '../../services/token.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BaseComponent } from '../base/base.component';
import { environment } from '../../environments/environment';
import { NotificationResponse } from '../../responses/notification.response';
import { ApiResponse } from '../../responses/api.response';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  imports: [
    CommonModule,
    NgbModule,
    RouterModule
  ]
})
export class HeaderComponent extends BaseComponent implements OnInit {
  account?: AccountResponse | null;
  isPopoverOpen?: boolean;
  cartItemCount: number = 0;
  unreadNotificationCount: number = 0;
  logoUrl?: string;
  logoname: string = 'logo2.png';

  activeNavItem: number = 0;
  navItems = [
    { name: 'Trang chủ', route: '/home' },
    { name: 'Thông báo', route: '/notification' },
    { name: 'Sản phẩm', route: '/products' },
    { name: 'Đơn hàng', route: '/orders' },
    { name: 'Tài khoản', route: '/account' },
    { name: 'Giới thiệu', route: '/introduce' },
    { name: 'Liên hệ', route: '/contact' },
  ];

  constructor() {
    super();
    this.cartService.cartItemCount$.subscribe(count => {
      this.cartItemCount = count;
    });

    this.cartService.cartChanged.subscribe(() => {
      this.cartItemCount = this.cartService.getCartItemCount();
    });
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    const foundIndex = this.navItems.findIndex(item => currentUrl.startsWith(item.route));
    this.activeNavItem = foundIndex !== -1 ? foundIndex : 0;

    debugger
    this.account = this.accountService.getAccountFromLocalStorage();
    this.cartItemCount = this.cartService.getCartItemCount();

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
          if (window.scrollY > 20) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
      });
    }

    this.logoUrl = `${environment.apiBaseUrl}/sanphams/images/${this.logoname}`;
    this.loadUnreadNotifications();
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadNotificationCount = count;
    });
  }

  updateCartCount(): void {
    this.cartItemCount = this.cartService.getCartItemCount();
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    if (index === 0) {
      debugger
      this.router.navigate(['/user-profile'])
    } else if (index === 2) {
      this.accountService.removeAccountFromLocalStorage();
      this.tokenService.removeToken()
      this.account = this.accountService.getAccountFromLocalStorage();
    }
    this.isPopoverOpen = false;
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
  }

  private loadUnreadNotifications(): void {
    debugger
    if (this.account && this.account.userid) {
      this.notificationService.getUnreadNotifications().subscribe({
        next: (apiResponse: ApiResponse) => {
          debugger
          this.unreadNotificationCount = (apiResponse.data as NotificationResponse[]).length;
          this.notificationService.updateUnreadCount(this.unreadNotificationCount);
        },
        error: (err) => {
          console.error('Lỗi khi tải số thông báo chưa đọc:', err);
        }
      });
    }
  }
}
