import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { DashboardService } from 'src/app/service/dashboard.service';

@Component({
  selector: 'app-bank-statement',
  templateUrl: './bank-statement.component.html',
  styleUrls: ['./bank-statement.component.scss'],
})
export class BankStatementComponent implements OnInit {
  subscription = new Subscription();
  patients: any[] = [];
  searchValue: any;
  orders: any[] = [];
  decisionNumber: any;
  patientName: any;
  totalPrice: number = 0 ;
  constructor(
    private dashboard: DashboardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.decisionNumber = this.route.snapshot.params['decisionNumber'];
    this.patientName = this.route.snapshot.params['patientName'];
    if (this.decisionNumber) {
      this.getPatientSalesForms();
    }
  }

  getPatientSalesForms() {
    if (this.decisionNumber) {
      let total = 0 ;
      const formData = new FormData();
      formData.append('decisionNumber', JSON.stringify(this.decisionNumber));
      this.subscription.add(this.dashboard.findAllSalesTimesByDecisionNumber(formData).subscribe((res) => {
        if (res) {
          this.orders = res;
          res.forEach((element: any) => {
           total = total + element.totalSellPrice ;
          });
          this.totalPrice = total ;
        }
      }));
    } else {
      this.totalPrice = 0 ;
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
