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

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  template: `
  <app-header></app-header>
    <div class="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-4xl mt-10">
      <div class="prose" [innerHTML]="content"></div>
    </div>
  `,
  imports: [
    CommonModule,
    HeaderComponent
]
})

export class TermsOfServiceComponent implements OnInit{
  content: string = '';

  constructor(private policyService: PolicyService) {}

  ngOnInit(): void {
    this.policyService.getTermsOfService().subscribe({
      next: (data) => this.content = data,
      error: (err) => console.error('Error loading terms of service', err)
    });
  }
}