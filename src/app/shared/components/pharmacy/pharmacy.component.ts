import { Ordres } from './../../models/Ordres';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-pharmacy',
  templateUrl: './pharmacy.component.html',
  styleUrls: ['./pharmacy.component.scss'],
})
export class PharmacyComponent implements OnInit {
  subscription = new Subscription();
  patientId: any;
  patientDate: any = {};
  patients: any[] = [];
  searchValue: any;
  treatments: any[] = [];
  treatmentData: any = {};


  // searchValue: any ;
  check: boolean = true;

  oldOrderPrice: number = 0;
  newOrderPrice: number = 0;
  totalOrderPrice: number = 0;

  months: any[] = [];
  orders: any[] = [];
  treatmentsNames: any[] = [];

  copyOrdersData: Ordres[] = [];

  // editable table for invoice
  productsBill: Array<any> = [];
  newProductsBill: any = {
    totalBuyPrice: 0,
    totalSellPrice: 0,
    sellPrice: 0,
    buyPrice: 0,
    amount: 0,
    treatmentName: '',
    isNew: 'false'
  };

  dateFrom = new Date();

  lastSaleFormId: any;
  patientsNames: any[] = [];
  constructor(
    private dashboard: DashboardService,
    private rout: ActivatedRoute,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.getAllTreatments();
    this.findAllPatients();
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
  search: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.treatmentsNames
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  copyOrders() {
    this.copyOrdersData = this.productsBill;
    // localStorage.setItem('orders' , JSON.stringify(this.copyOrdersData)) ;
  }

  pasteOrders() {
    this.copyOrdersData.forEach((element) => {
      this.productsBill.push(element);
    });
    // this.copyOrdersData = [];
  }
  addBill() {
    if (
      this.productsBill.length > 0 &&
      this.totalOrderPrice <= this.patientDate.totalAmountNow
    ) {
      const formData = new FormData();
      formData.append('orders', JSON.stringify(this.productsBill));
      formData.append('patient', JSON.stringify(this.patientDate));
      this.subscription.add(
        this.dashboard.addTreatmentToPatientByPharmacy(formData).subscribe(
          (res) => {
            if (res) {
              alert('تم صرف الفاتورة بنجاح');
              this.productsBill = [];
              this.newProductsBill = {};
              this.patientDate.totalAmountNow = 0 ;
            }
          },
          (err) => {
            alert('يوجد خطأ في عملية البيع');
          }
        )
      );
    } else {
      alert('اجمالي سعر الادوية اكبر من المبلغ المستحق');
    }
  }

  getNewTreatment(event: Event) {
    const treatmentName = (event.target as HTMLInputElement).value;
    this.treatmentData = this.treatments.find(
      (item) => item.treatmentName == treatmentName
    );
    if (this.treatmentData) {
      this.newProductsBill.sellPrice = +this.treatmentData.sellPrice;
      this.newProductsBill.buyPrice = +this.treatmentData.buyPrice;
    }
  }

  checkTreatmentAmount(amount: any) {
    if (amount > this.treatmentData.treatmentAmount) {
      alert('كمية الدواء الموجوده من '+ this.treatmentData.treatmentName +' = اقل من المطلوب ------- يوجد عدد ' + this.treatmentData.treatmentAmount) ;
    }
  }

  updateValueOld(newProductsBill: any) {
    let value: number = 0;
    this.productsBill.forEach((element) => {
      value = value + element.totalSellPrice;
      if (value <= this.patientDate.totalAmountNow) {
        newProductsBill.totalSellPrice = +(
          +newProductsBill.sellPrice * +newProductsBill.amount
        );
        newProductsBill.totalBuyPrice = +(
          +newProductsBill.buyPrice * +newProductsBill.amount
        );
      } else {
        //alert('اجمالي سعر الادوية اكبر من المبلغ المستحق');
        // this.totalOrderPrice = 0;
        // value = 0;
      }
    });
    this.totalOrderPrice = value;
  }

  getTotalSellPrice() {
    this.totalOrderPrice = 0;
    let total = 0;
    this.productsBill.forEach((element) => {
      total = total + element.totalSellPrice;
    });
    this.totalOrderPrice = total;
  }

  updateAllValues() {
    this.productsBill.forEach((element) => {
      element.totalSellPrice = +(+element.sellPrice * +element.amount);
      element.totalBuyPrice = +(+element.buyPrice * +element.amount);
    });
  }
  updateValue() {
    this.updateValueOld(this.newProductsBill);
    this.newProductsBill.totalSellPrice =
      this.newProductsBill.sellPrice * this.newProductsBill.amount;
    this.newProductsBill.totalBuyPrice =
      this.newProductsBill.buyPrice * this.newProductsBill.amount;
    if (
      this.totalOrderPrice + this.newProductsBill.totalSellPrice >
      this.patientDate.totalAmountNow
    ) {
      alert('اجمالي سعر الادوية اكبر من المبلغ المستحق');
      this.updateValueOld(this.newProductsBill);
      this.newProductsBill.amount = 0;
      this.newProductsBill.totalBuyPrice = 0;
      this.newProductsBill.totalSellPrice = 0;
    }
  }

  addRow() {
    this.productsBill.push(this.newProductsBill);
    this.updateValueOld(this.newProductsBill);
    this.newProductsBill = {};
  }

  deleteRow(index: any) {
    this.productsBill.splice(index, 1);
  }



  getPatientSalesForms() {
    if (this.patientDate.patientId) {
      let id;
      const formData = new FormData();
      formData.append(
        'decisionNumber',
        JSON.stringify(this.patientDate.decisionNumber)
      );
      this.subscription.add(
        this.dashboard.getPatientSalesForms(formData).subscribe((res) => {
          if (res) {
            id = res[res.length - 1];
            this.findAllBySaleFormSaleFormId(id.saleFormId);
          }
        })
      );
    } else {
    }
  }


  findAllBySaleFormSaleFormId(id: any) {
    this.productsBill = [];
    this.subscription.add(
      this.dashboard.findAllBySaleFormSaleFormId(id).subscribe((res) => {
        if (res) {
          res.forEach((element: any) => {
            this.productsBill.push({
              totalBuyPrice: element.totalBuyPrice,
              totalSellPrice: element.totalSellPrice,
              sellPrice: element.sellPrice,
              buyPrice: element.buyPrice,
              amount: element.amount,
              treatmentName: element.treatmentName,
            });
          });
        }
      })
    );
  }

  getMonthes() {
    if (this.patientDate.patientId) {
      this.subscription.add(
        this.dashboard
          .findBillMonthsPatientById(this.patientDate.patientId)
          .subscribe((res) => {
            if (res) {
              this.months = res;
            }
          })
      );
    }
  }

  getAllTreatments() {
    this.subscription.add(
      this.dashboard.findAllTreatments().subscribe((res) => {
        if (res) {
          this.treatments = res;
          res.forEach((element: any) => {
            if (element.treatmentAmount > 0) {
              this.treatmentsNames.push(element.treatmentName);
            }
          });
        }
      })
    );
  }


  // البحث عن المريض من خلال رقم القرار او الاسم
  getPatient() {
    this.orders = [];
    if (this.searchValue.length > 2 && this.patients.length > 0) {
      this.patientDate = this.patients.find(
        (item) =>
          item.decisionNumber == this.searchValue ||
          item.patientName == this.searchValue ||
          item.nationalId == this.searchValue
      );
      if (this.patientDate) {
        this.getOrders();
        this.getMonthes();
        this.getPatientSalesForms();
      }
    } else {
      this.patients = [];
      this.patientDate = {};
      this.months = [];
      this.subscription.add(
        this.dashboard.findAllPatients().subscribe((res) => {
          if (res) {
            this.patients = res;
          }
        })
      );
    }
  }
  getPatientsByDay() {
    if (this.dateFrom) {
      this.patients = [];
      this.patientsNames = [];
      const formData = new FormData();
      formData.append('createdDate', JSON.stringify(this.dateFrom));
      this.subscription.add(
        this.dashboard
          .findAllPatientsByCreatedDate(formData)
          .subscribe((res) => {
            this.patients = res;
            res.forEach((element: { patientName: any }) => {
              this.patientsNames.push(element.patientName);
            });
          })
      );
    }
  }
  getPatientBySelected(event: any) {
    this.searchValue = event.target.value;
    this.getPatient();
  }
  findAllPatients() {
    this.patients = [];
    this.patientsNames = [];
    this.subscription.add(
      this.dashboard.findAllPatients().subscribe((res) => {
        if (res) {
          this.patients = res;
          res.forEach((element: { patientName: any }) => {
            this.patientsNames.push(element.patientName);
          });
        }
      })
    );
  }
  getOrders() {
    if (this.patientDate.patientId) {
      this.subscription.add(
        this.dashboard
          .findAllOrdersByPatientId(this.patientDate.patientName)
          .subscribe((res) => {
            if (res) {
              res.forEach((element: any) => {
                if (element.amount > 0) {
                } else {
                  this.productsBill.push(element);
                }
              });
            }
          })
      );
    }
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
