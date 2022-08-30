import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-sale-forms',
  templateUrl: './sale-forms.component.html',
  styleUrls: ['./sale-forms.component.scss'],
})
export class SaleFormsComponent implements OnInit {
  subscription = new Subscription();
  patientDate: any = {};
  patients: any[] = [];
  sales: any[] = [];
  searchValue: any;
  orders: any[] = [];
  patientsNames: any[] = [];
  dateFrom = new Date() ;
  totalPrice: number = 0;
  constructor(
    private dashboard: DashboardService,
    private rout: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    // this.findAllPatients();
    this.findAllBySaleFormCreatedDateFromTo() ;
  }
  searchPatient: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.patientsNames
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );
  // البحث عن المريض من خلال رقم القرار او الاسم
  getPatient() {
    this.findAllPatients() ;
    if (this.searchValue.length > 1 && this.patients.length > 0) {
      this.patientDate = this.patients.find(
        (item) =>
        item.decisionNumber == this.searchValue ||
        item.patientName == this.searchValue ||
        item.nationalId == this.searchValue
      );
      if (this.patientDate.patientId) {
        this.getPatientSalesForms() ;
      }
    } else {
      this.patients = [];
      this.orders = []
      this.patientsNames = [] ;
      this.sales = []
      this.patientDate = {};
      this.findAllBySaleFormCreatedDateFromTo() ;
    }
  }
  findAllPatients() {
    this.subscription.add(
      this.dashboard.findAllPatients().subscribe((res) => {
        if (res) {
          this.patients = res;
        }
      })
    );
  }
  getPatientSalesForms() {
    this.sales = [] ;
    this.orders = []
    if (this.patientDate.patientId) {
      const formData = new FormData();
      formData.append(
        'decisionNumber',
        JSON.stringify(this.patientDate.decisionNumber)
      );
      this.subscription.add(
        this.dashboard.getPatientSalesForms(formData).subscribe((res) => {
          if (res) {
            // console.log(res) ;
            this.sales = res;
          }
        })
      );
    } else {
      this.totalPrice = 0;
      this.sales = [] ;
    }
  }

  findAllBySaleFormSaleFormId(id: any , price: any) {
    this.totalPrice = 0;
    this.orders = []
    this.subscription.add(
      this.dashboard.findAllBySaleFormSaleFormId(id).subscribe((res) => {
        if (res) {
          // console.log(res) ;
          this.orders = res;
          this.totalPrice = price;
        }
      })
    );
  }

  findAllBySaleFormCreatedDateFromTo() {
    this.sales = [] ;
    this.patientsNames = [] ;
    if (this.dateFrom) {
      const formData = new FormData();
      formData.append('dateFrom', JSON.stringify(this.dateFrom));
      this.subscription.add(
        this.dashboard.findAllBySaleFormCreatedDateFromTo(formData).subscribe((res) => {
            if (res) {
              res.forEach((element: { patientName: any }) => {
                if (!this.patientsNames.includes(element.patientName)) {
                  this.patientsNames.push(element.patientName);
                }
              });
            }
        })
      );
    }
  }
  getPatientBySelected(event: any) {
    this.orders = [] ;
    this.searchValue = event.target.value ;
    this.getPatient() ;
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
