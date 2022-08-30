import { DatePipe, formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-pharmacy-balance',
  templateUrl: './pharmacy-balance.component.html',
  styleUrls: ['./pharmacy-balance.component.scss'],
})
export class PharmacyBalanceComponent implements OnInit {
  subscription = new Subscription();
  myDate: Date = new Date();
  realDate: any;
  pharmacies: any[] = [];
  constructor(
    private dashboard: DashboardService,
    private datePipe: DatePipe
  ) {
    this.realDate = this.datePipe.transform(this.myDate, 'yyyy/MM/dd' || '{} ');

  }

  ngOnInit(): void {
    this.findAllPharmacys();
    this.getDay();
  }
  getDay() {
    const day_now = new Date().toLocaleString('en-Us', { day: '2-digit' });
    if (parseInt(day_now) == 1) {
      //المتبيقي = الرصيد
      this.subscription.add(this.dashboard.setRestEqualAmount().subscribe(res => {
        if (res) {
          this.pharmacies = res ;
        }
      }))
    }
  }

  findAllPharmacys() {
    this.subscription.add(this.dashboard.findAllPharmacys().subscribe((res) => {
      if (res) {
          this.pharmacies = res ;
      }
    }));
  }

  delete(id: any) {
    if (confirm('هل انت متأكد من الحذف ؟؟')) {
      this.subscription.add( this.dashboard.deletePharmacy(id).subscribe((res) => {
        if (res) {
          this.pharmacies = res ;
        }
      }));
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
