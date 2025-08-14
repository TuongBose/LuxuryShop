import { CartItemDTO } from './cartitem.dto';

export class OrderDTO{
    userid: number;
    fullname:string;
    email:string;
    sodienthoai:string;
    diachi:string;
    ghichu:string;
    tongtien:number;
    phuongthucthanhtoan:string;
    status:string;
    vnp_TxnRef?:string;
    cartitems: CartItemDTO[];

  constructor(data:any){
    this.userid=data.userid;
    this.fullname=data.fullname;
    this.email=data.email;
    this.sodienthoai=data.sodienthoai;
    this.diachi=data.diachi;
    this.ghichu=data.ghichu;
    this.tongtien=data.tongtien;
    this.phuongthucthanhtoan=data.phuongthucthanhtoan;
    this.status=data.status;
    this.vnp_TxnRef = data.vnp_TxnRef;
    this.cartitems=data.cartitems
  }
}