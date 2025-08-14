// src/app/models/order-status.ts
export enum OrderStatus {
  PENDING = 'Chưa xử lý',
  PROCESSING = 'Đang xử lý',
  SHIPPED = 'Đang vận chuyển',
  DELIVERED = 'Giao hàng thành công',
  CANCELLED = 'Đã hủy'
}