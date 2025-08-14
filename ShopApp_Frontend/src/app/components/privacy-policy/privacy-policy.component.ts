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
import { PolicyService } from "../../services/policy.service";
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  template: `
  <app-header></app-header>
    <div class="container">
      <div class="prose" [innerHTML]="content"></div>
    </div>
  `,
  imports: [
    CommonModule,
    HeaderComponent,
  ]
})

export class PrivacyPolicyComponent implements OnInit {
  content: string = '';

  constructor(private policyService: PolicyService) { }

  ngOnInit(): void {
    debugger
    this.policyService.getPrivacyPolicy().subscribe({
      next: (data) => { debugger; this.content = data; },
      error: (err) => console.error('Error loading privacy policy', err)
    });
  }
}