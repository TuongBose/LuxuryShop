import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../environments/environment';
import { SanPham } from '../../models/sanpham';
import { SanPhamService } from '../../services/sanpham.service';
import { LoaiSanPham } from '../../models/loaisanpham';
import { LoaiSanPhamService } from '../../services/loaisanpham.service';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { BaseComponent } from '../base/base.component';
import { ApiResponse } from '../../responses/api.response';

@Component({
  selector: 'app-contact',
  standalone: true,
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule
  ]

})
export class ContactComponent extends BaseComponent implements OnInit{
  @ViewChild('contactForm') contactForm?: ElementRef<HTMLFormElement>;

  view: string = 'view.png';
  viewUrl?: string;

  ngOnInit(): void {
    this.viewUrl = `${environment.apiBaseUrl}/sanphams/images/${this.view}`;
  }

  sendMessage(): void {
    this.toastService.showToast({
      defaultMsg: 'Cảm ơn bạn đã gửi lời nhắn cho chúng tôi',
      title: 'Thông báo',
      delay: 3000,
      type: 'success'
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (this.contactForm?.nativeElement) {
      this.contactForm.nativeElement.reset();
    }
  }
}
