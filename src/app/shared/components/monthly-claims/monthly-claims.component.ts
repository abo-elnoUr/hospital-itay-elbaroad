import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-monthly-claims',
  templateUrl: './monthly-claims.component.html',
  styleUrls: ['./monthly-claims.component.scss'],
})
export class MonthlyClaimsComponent implements OnInit {
  subscription = new Subscription();
  dateFrom = new Date();
  dateto = new Date();
  monthlyClaiamsReports = new Map<String, Map<Date, Number>>();
  monthlyClaiamsReportsPrice = new Map<String, Number>();
  constructor(private dashboard: DashboardService) {}
  ngOnInit(): void {}

  findAllMonthlyClames() {
    const formData = new FormData();
    if (this.dateFrom <= this.dateto) {
      formData.append('dateFrom', JSON.stringify(this.dateFrom));
      formData.append('dateTo', JSON.stringify(this.dateto));
      this.subscription.add(
        this.dashboard.findAllMonthlyClames(formData).subscribe((res) => {
          if (res) {
            this.monthlyClaiamsReports = res.monthlyClaiamsReports;
            this.monthlyClaiamsReportsPrice = res.monthlyClaiamsReportsPrice;
          }
        })
      );
    } else {
      alert('من فضلك قم باختيار تاريخ مناسب');
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
