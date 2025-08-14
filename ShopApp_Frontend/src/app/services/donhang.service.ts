import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { LoaiSanPham } from "../models/loaisanpham";
import { OrderDTO } from "../dtos/order.dto";
import { DonHang } from "../models/donhang";
import { ApiResponse } from "../responses/api.response";

@Injectable({
    providedIn: 'root'
})

export class DonHangService {
    private apiCreateDonHang = `${environment.apiBaseUrl}/donhangs`;
    constructor(private http: HttpClient) { }

    placeOrder(orderData: OrderDTO): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(this.apiCreateDonHang, orderData);
    }

    getDonHangById(maDonHang: number): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(`${environment.apiBaseUrl}/donhangs/${maDonHang}`);
    }

    updateOrderStatus(vnp_TxnRef: string, status: string): Observable<ApiResponse> {
        debugger
        const params = new HttpParams()
            .set('status', status.toString())
            .set('vnpTxnRef', vnp_TxnRef.toString());
        const url = `${environment.apiBaseUrl}/donhangs/status`;
        return this.http.put<ApiResponse>(url,null, { params });
    }
}