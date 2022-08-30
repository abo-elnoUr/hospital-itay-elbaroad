import { map } from 'rxjs/operators';
import { Ordres } from './../../models/Ordres';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';

import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements OnInit {
  subscription = new Subscription();
  dateFrom = new FormControl('');
  dateTo = new FormControl('');
  treatments: any[] = [];
  sum = 0;
  orders: any[] = [];
  map = new Map<String, Map<Date, Number>>()
  maps = new Map<String, Number>()
  constructor(private dashboard: DashboardService) { }

  ngOnInit(): void {
    this.getPatientNameReports();
  }

  getReports() {
    this.treatments = [];
    if (this.dateFrom.value <= this.dateTo.value) {
      const formData = new FormData();
      formData.append('dateFrom', JSON.stringify(this.dateFrom.value));
      formData.append('dateTo', JSON.stringify(this.dateTo.value));
      this.subscription.add(
        this.dashboard.findAllBySalesFormTimesCreatedDateFromTo(formData).subscribe((res) => {
          if (res) {
            this.map = res.treatmentsReports;
            this.maps = res.treatmentsReportsAmount;

          } else {
            this.treatments = [];
          }
        })
      );
    }
  }

  getValue(key: any, event: any) {
    this.sum = 0;
    let map: Map<Date, Number> = event;
    let k: Date = key;
    for (const key in event) {
      this.sum += event[key];
    }
  }

  getPatientNameReports() {
    // this.treatments = [];
    if (this.dateFrom.value <= this.dateTo.value) {
      const formData = new FormData();
      formData.append('dateFrom', JSON.stringify(this.dateFrom.value));
      formData.append('dateTo', JSON.stringify(this.dateTo.value));
      this.subscription.add(
        this.dashboard.getPatientNameReports().subscribe((res) => {
          if (res) {
            res.forEach((element: any) => {
              if (this.orders.includes(element.patientName)) {
              } else {
                this.orders.push(element.patientName);

              }
            });
            this.orders.sort();
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
