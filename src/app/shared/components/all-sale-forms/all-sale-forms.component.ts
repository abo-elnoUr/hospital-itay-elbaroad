import { DashboardService } from 'src/app/service/dashboard.service';
import { Component, OnInit } from '@angular/core';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'app-all-sale-forms',
  templateUrl: './all-sale-forms.component.html',
  styleUrls: ['./all-sale-forms.component.scss'],
})
export class AllSaleFormsComponent implements OnInit {
  subscription = new Subscription();
  sales: any[] = [];
  patientNames: any[] = [];
  diagnosis: any[] = [];
  patients: any[] = [];
  patientId: any;
  patientDate: any = {};
  saleFormId : any ;
  searchPatientValue: any;
  searchDiagnosisValue: any;
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

  // editable table for invoice
  productsBill: Array<any> = [];
  newProductsBill: any = {
    ordersId: 0,
    totalBuyPrice: 0,
    totalSellPrice: 0,
    sellPrice: 0,
    buyPrice: 0,
    amount: 0,
    treatmentName: '',
    isNew: '',
  };

  dateFrom = new Date();

  lastSaleFormId: any;
  patientsNames: any[] = [];
  decisionAmount = 0;
  message = '';
  constructor(private dashboard: DashboardService) {}
  ngOnInit(): void {
    this.getSalesFormByDay();
    this.getAllTreatments();
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
  searchDiagnosis: OperatorFunction<string, readonly string[]> = (
    text$: Observable<string>
  ) =>
    text$.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      map((term) =>
        term.length < 1
          ? []
          : this.diagnosis
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );
  addBill(totalAmountNow: any) {
    if (
      this.productsBill.length > 0 &&
      this.totalOrderPrice <= totalAmountNow
    ) {
      const formData = new FormData();
      formData.append('saleFormId', JSON.stringify(this.saleFormId));
      formData.append('orders', JSON.stringify(this.productsBill));
      this.subscription.add(
        this.dashboard.updateOrders(formData).subscribe(
          (res) => {
            if (res) {
              alert('تم تعديل الفاتورة بنجاح');
              this.message = 'تم تعديل الفاتورة بنجاح';
              setTimeout(() => {
                this.message = '';
              }, 5000);
              this.productsBill = [];
              this.newProductsBill = {};
              this.sales = [] ;
              location.reload() ;
            }
          },
          (err) => {
            this.message = 'يوجد خطأ في عملية التعديل';
            setTimeout(() => {
              this.message = '';
            }, 5000);
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
      alert(
        'كمية الدواء الموجوده من ' +
          this.treatmentData.treatmentName +
          ' = اقل من المطلوب ----------- يوجد عدد ' +
          this.treatmentData.treatmentAmount
      );
    }
  }

  updateValueOld(newProductsBill: any, decisionAmount: any) {
    let value: number = 0;
    this.productsBill.forEach((element) => {
      value = value + element.totalSellPrice;
      if (value <= decisionAmount) {
        newProductsBill.totalSellPrice = +(
          +newProductsBill.sellPrice * +newProductsBill.amount
        );
        newProductsBill.totalBuyPrice = +(
          +newProductsBill.buyPrice * +newProductsBill.amount
        );
      } else {
        // alert('اجمالي سعر الادوية اكبر من المبلغ المستحق');
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
  updateValue(decisionAmount: any) {
    this.updateValueOld(this.newProductsBill, decisionAmount);
    this.newProductsBill.totalSellPrice =
      this.newProductsBill.sellPrice * this.newProductsBill.amount;
    this.newProductsBill.totalBuyPrice =
      this.newProductsBill.buyPrice * this.newProductsBill.amount;
    if (
      this.totalOrderPrice + this.newProductsBill.totalSellPrice >
      decisionAmount
    ) {
      alert('اجمالي سعر الادوية اكبر من المبلغ المستحق');
      this.newProductsBill.amount = 0;
      this.newProductsBill.totalBuyPrice = 0;
      this.newProductsBill.totalSellPrice = 0;
      this.updateValueOld(this.newProductsBill, decisionAmount);
    }
  }

  addRow(decisionAmount: any) {
    this.productsBill.push(this.newProductsBill);
    this.updateValueOld(this.newProductsBill, decisionAmount);
    this.newProductsBill = {};
  }

  deleteRow(index: any, id: any) {
    if (confirm('هل انت متأكد من حذف هذا الدواء ؟؟')) {
      this.subscription.add(
        this.dashboard.deleteSaleFormTimeById(id).subscribe((res) => {
          if (res) {
            alert('تم حذف هذا العلاج من الاستمارة')
          }
        })
      );
      this.productsBill.splice(index, 1);
    }
  }

  findAllBySaleFormSaleFormId(id: any) {
    this.saleFormId = id ;

    this.productsBill = [];
    this.subscription.add(
      this.dashboard.findAllBySaleFormSaleFormId(id).subscribe((res) => {
        if (res) {
          res.forEach((element: any) => {
            this.productsBill.push({
              // saleFormTimesId: element.saleFormTimesId ,
              ordersId: element.orderSaleFormId,
              totalBuyPrice: element.totalBuyPrice,
              totalSellPrice: element.totalSellPrice,
              sellPrice: element.sellPrice,
              buyPrice: element.buyPrice,
              amount: element.amount,
              treatmentName: element.treatmentName,
              isNew: 'false',
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
    // this.treatments = [] ;
    this.subscription.add(
      this.dashboard.findAllTreatments().subscribe((res) => {
        if (res) {
          this.treatments = res;
          res.forEach((element: any) => {
            if (element.treatmentAmount > 0) {
              this.treatmentsNames.push(element.treatmentName);
              // this.treatments.push(element)
            }
          });
        }
      })
    );
  }

  getPatient() {
    this.sales = [];
    if (this.searchPatientValue) {
      if (this.dateFrom == null) {
        this.dateFrom = new Date();
      }
      const formData = new FormData();
      formData.append('patientName', JSON.stringify(this.searchPatientValue));
      formData.append('createdDate', JSON.stringify(this.dateFrom));
      this.subscription.add(
        this.dashboard
          .findAllSalesFormsByPatientName(formData)
          .subscribe((res) => {
            if (res) {
              this.sales = res;
            }
          })
      );
    } else {
      this.getSalesFormByDay();
    }
  }

  getSaleForm() {
    this.sales = [];
    if (this.searchDiagnosisValue) {
      if (this.dateFrom == null) {
        this.dateFrom = new Date();
      }
      const formData = new FormData();
      formData.append('diagnosis', JSON.stringify(this.searchDiagnosisValue));
      formData.append('createdDate', JSON.stringify(this.dateFrom));
      this.subscription.add(
        this.dashboard
          .findAllSalesFormsByDiagnosis(formData)
          .subscribe((res) => {
            if (res) {
              console.log(res);

              this.sales = res;
            }
          })
      );
    } else {
      this.getSalesFormByDay();
    }
  }
  getSalesFormByDay() {
    if (this.dateFrom) {
      this.patients = [];
      this.patientsNames = [];
      const formData = new FormData();
      formData.append('createdDate', JSON.stringify(this.dateFrom));
      this.subscription.add(
        this.dashboard.findAllSalesFormsPrint(formData).subscribe((res) => {
          if (res) {
            this.sales = res;
            res.forEach((element: any) => {
              this.patientNames = element['patientNames'];
              this.diagnosis = element['diagnosis'];
            });
          }
        })
      );
    }
  }

  getPatientBySelected(event: any) {
    this.searchPatientValue = event.target.value;
    this.getPatient();
  }
  getSalesBySelected(event: any) {
    this.searchDiagnosisValue = event.target.value;
    this.getSaleForm();
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

  deleteAllBySaleFormSaleFormId(id: any) {
    if (confirm('هل انت متأكد من حذف هذه الاستمارة ؟')) {
      this.subscription.add(
        this.dashboard.deleteAllBySaleFormSaleFormId(id).subscribe((res) => {
          if (res) {
            this.getSalesFormByDay();
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
