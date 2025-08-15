import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { SanPham } from '../../models/sanpham';
import { OrderDTO } from '../../dtos/order.dto';
import { CartService } from '../../services/cart.service';
import { SanPhamService } from '../../services/sanpham.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DonHangService } from '../../services/donhang.service';
import { TokenService } from '../../services/token.service';
import { environment } from '../../environments/environment';
import { Router, RouterModule } from '@angular/router';
import { DonHang } from '../../models/donhang';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { PaymentService } from '../../services/payment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastService } from '../../services/toast.service';
import { error } from 'console';
import { BaseComponent } from '../base/base.component';
import { ApiResponse } from '../../responses/api.response';

@Component({
  selector: 'app-order',
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  imports: [
    HeaderComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class OrderComponent extends BaseComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  indexError: number[] = [];
  hasStockIssue: boolean = false;
  loading: boolean = false;
  cart: Map<number, number> = new Map();
  orderForm: FormGroup;
  cartItems: { sanPham: SanPham, quantity: number }[] = [];
  couponDiscount: number = 0; //số tiền được discount từ coupon
  couponApplied: boolean = false;
  totalAmount: number = 0;
  orderData: OrderDTO = {
    userid: 0,
    fullname: '',
    email: '',
    sodienthoai: '',
    diachi: '',
    ghichu: '',
    tongtien: 0,
    phuongthucthanhtoan: 'cod',
    status: '',
    cartitems: []
  }

  constructor() {
    super();

    this.orderForm = this.formBuilder.group({
      fullname: ['tuong', [Validators.required]],
      email: ['tuong@gmail.com', [Validators.email]],
      sodienthoai: ['090009848', [Validators.required, Validators.minLength(6)]],
      diachi: ['123 le trong tan, phuong 5', [Validators.required, Validators.minLength(5)]],
      ghichu: [''],
      couponCode: [''],
      phuongthucthanhtoan: ['cod']
    });

    this.cartService.cartChanged.subscribe(() => {
      this.cart = this.cartService.getCart();
      this.updateCartItems();
      this.cdr.detectChanges();
    });
  }

  ngOnInit(): void {
    debugger
    this.orderData.userid = this.tokenService.getUserId();
    this.cartService.forceRefreshCart();
    this.cart = this.cartService.getCart();
    this.updateCartItems();


    const maSanPhamList = Array.from(this.cart.keys()); // Truyền danh sách MASANPHAM từ Map giỏ hàng

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách MASANPHAM
    debugger
    if (maSanPhamList.length === 0) {
      return;
    }

    this.sanPhamService.getSanPhamByMASANPHAMList(maSanPhamList).subscribe({
      next: (apiResponse: ApiResponse) => {
        const sanPhams: SanPham[] = apiResponse.data.sanPhamResponseList;
        debugger
        this.cartItems = maSanPhamList.map((masanpham) => {
          debugger
          const sanPham = sanPhams.find((p) => p.masanpham === masanpham);
          if (sanPham) {
            sanPham.thumbnail = `${environment.apiBaseUrl}/sanphams/images/${sanPham.thumbnail}`
          }
          return {
            sanPham: sanPham!,
            quantity: this.cart.get(masanpham)!
          };
        });

        this.cartItems.forEach((cartItem, index) => {
          if (cartItem.sanPham.soluongtonkho < cartItem.quantity) {
            this.hasStockIssue = true;
            this.indexError.push(index);
            this.toastService.showToast({
              defaultMsg: `Sản phẩm "${cartItem.sanPham.tensanpham}" không đủ hàng trong kho (Còn ${cartItem.sanPham.soluongtonkho} sản phẩm).`,
              title: 'Thông báo',
              delay: 3000,
              type: 'danger'
            });
            this.loading = false;
            return;
          }
        });
      },
      complete: () => {
        debugger
        this.calculateTotal();
      },
      error: (error: HttpErrorResponse) => {
        debugger
        console.error(error?.error?.message ?? '')
      }
    })
  }

  placeOrder() {
    debugger
    if (this.orderForm.errors == null) {
      debugger
      if (!this.hasStockIssue) {
        // Gán giá trị từ form vào đối tuọng orderData
        /*
        this.orderData.fullname = this.orderForm.get('fullname')!.value;
        this.orderData.email=this.orderForm.get('email')!.value;
        this.orderData.sodienthoai=this.orderForm.get('sodienthoai')!.value;
        this.orderData.diachi=this.orderForm.get('diachi')!.value;
        this.orderData.ghichu=this.orderForm.get('ghichu')!.value;
        this.orderData.phuongthucthanhtoan=this.orderForm.get('phuongthucthanhtoan')!.value;
        */
        // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
        this.orderData = {
          ...this.orderData,
          ...this.orderForm.value
        };
        this.orderData.cartitems = this.cartItems.map(cartItem => ({
          masanpham: cartItem.sanPham.masanpham,
          quantity: cartItem.quantity
        }));

        this.orderData.tongtien = this.totalAmount;

        debugger
        if (this.orderData.phuongthucthanhtoan === 'vnpay') {
          this.handleVnpayPayment();
        } else {
          this.handleCodPayment();
        }
      } else {
        debugger
        this.loading = false;
        this.indexError.forEach(index => {
          const cartItem = this.cartItems[index];
          this.toastService.showToast({
            defaultMsg: `Sản phẩm "${cartItem.sanPham.tensanpham}" không đủ hàng trong kho (Còn ${cartItem.sanPham.soluongtonkho} sản phẩm).`,
            title: 'Thông báo',
            delay: 3000,
            type: 'danger'
          });
        });
      }
    }
  }

  private handleVnpayPayment(): void {
    debugger
    const amount = this.orderData.tongtien || 0;
    this.loading = true; // Hiển thị loading
    this.paymentService.createPaymentUrl({ amount, language: 'vn' }).subscribe({
      next: (res: ApiResponse) => {
        const paymentUrl = res.data as string;
        const vnp_TxnRef = new URL(paymentUrl).searchParams.get('vnp_TxnRef') || '';

        this.donHangService.placeOrder({ ...this.orderData, vnp_TxnRef }).subscribe({
          next: (placeOrderResponse: ApiResponse) => {
            this.loading = false;
            window.location.href = paymentUrl;
          },
          error: (err: HttpErrorResponse) => {
            this.loading = false;
            this.toastService.showToast({
              defaultMsg: 'Lỗi trong quá trình đặt hàng',
              title: 'Thông báo',
              delay: 3000,
              type: 'danger'
            });
          }
        });
      },
      error: (err: HttpErrorResponse) => {
        this.loading = false;
        this.toastService.showToast({
          defaultMsg: 'Lỗi kết nối đến cổng thanh toán',
          title: 'Thông báo',
          delay: 3000,
          type: 'danger'
        });
      }
    });
  }

  private handleCodPayment(): void {
    debugger
    this.loading = true;
    this.donHangService.placeOrder(this.orderData).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.loading = false;
        this.toastService.showToast({
          defaultMsg: 'Đặt hàng thành công',
          title: 'Thông báo',
          delay: 3000,
          type: 'success'
        });
        this.cartService.clearCart();
        this.router.navigate(['/']);
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.toastService.showToast({
          defaultMsg: 'Lỗi khi đặt hàng',
          title: 'Thông báo',
          delay: 3000,
          type: 'danger'
        });
      }
    });
  }

  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.sanPham.gia * item.quantity,
      0
    ) - this.couponDiscount;
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal();
      this.cdr.detectChanges();
    }
  }

  increaseQuantity(index: number): void {
    if (this.cartItems[index].sanPham.soluongtonkho > this.cartItems[index].quantity) {
      this.cartItems[index].quantity++;
    } else {
      this.toastService.showToast({
        defaultMsg: `Sản phẩm "${this.cartItems[index].sanPham.tensanpham}" không đủ hàng trong kho (Còn ${this.cartItems[index].sanPham.soluongtonkho} sản phẩm).`,
        title: 'Thông báo',
        delay: 3000,
        type: 'danger'
      });
    }

    debugger;
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems();
    this.calculateTotal();
    this.cdr.detectChanges();
  }

  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      // Xoa san pham khoi danh sach cartItems
      this.cartItems.splice(index, 1);
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      // Tinh toan lai tong tien
      this.calculateTotal();
      this.cdr.detectChanges();
    }

  }

  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.sanPham.masanpham, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }

  applyCoupon(): void {
    // Xử lý áp dụng mã giảm giá
    // cập nhật giá trị totalAmount dựa trên mã giảm giá
    debugger
    const couponCode = this.orderForm.get('couponCode')!.value;
    if (!this.couponApplied && couponCode) {
      this.loading = true;
      this.calculateTotal();
      this.couponService.calculateCouponValue(couponCode, this.totalAmount).subscribe({
        next: (apiResponse: ApiResponse) => {
          this.couponDiscount = apiResponse.data as number;
          this.totalAmount -= this.couponDiscount;
          this.couponApplied = true;
          this.loading = false;
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.toastService.showToast({
            defaultMsg: 'Mã giảm giá không hợp lệ',
            title: 'Thông báo',
            delay: 3000,
            type: 'danger'
          });
        }
      });
    }
  }

  private updateCartItems(): void {
    const maSanPhamList = Array.from(this.cart.keys());
    if (maSanPhamList.length === 0) {
      this.cartItems = [];
      this.calculateTotal();
      return;
    }

    this.sanPhamService.getSanPhamByMASANPHAMList(maSanPhamList).subscribe({
      next: (apiResponse: ApiResponse) => {
        const sanPhams: SanPham[] = apiResponse.data.sanPhamResponseList;
        this.cartItems = maSanPhamList.map((masanpham) => {
          const sanPham = sanPhams.find((p) => p.masanpham === masanpham);
          if (sanPham) {
            sanPham.thumbnail = `${environment.apiBaseUrl}/sanphams/images/${sanPham.thumbnail}`;
          }
          return {
            sanPham: sanPham!,
            quantity: this.cart.get(masanpham)!
          };
        });
        this.calculateTotal();
        this.cdr.detectChanges(); // Cập nhật giao diện
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }
}
