import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-discount-coupon',
  templateUrl: './discount-coupon.component.html',
  styleUrls: ['./discount-coupon.component.scss']
})
export class DiscountCouponComponent implements OnInit {
  dtOptions: any = {};
  animal: any;
  
  constructor() { }

  // constructor() {
    
  //   localStorage.setItem('isBusiness', 'false');
  //  }

  ngOnInit() {
  }

}
