import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Observable, OperatorFunction } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-pharmacy-data',
  templateUrl: './pharmacy-data.component.html',
  styleUrls: ['./pharmacy-data.component.scss']
})
export class PharmacyDataComponent implements OnInit {

  patientId: any;
  patientDate: any = {};
  patients: any[] = [];
  searchValue: any;
  treatments: any[] = [];
  newTreatments: any[] = [];
  orders: any[] = [];
  treatmentsNames: any[] = [];
  months: any[] = [];
  treatmentName: any;
  treatmentAmount: number = 0;
  treatmentDate: any = {};
  totalSellvalue: number = 0;
  totalPrice: number = 0;
  show = false;
  constructor(
    private dashboard: DashboardService,
    private rout: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.patientId = this.rout.snapshot.params['patientId'];
    this.getAllTreatments();
  }

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
  remove(treatment: any) {
    if (this.newTreatments.includes(treatment)) {
      this.newTreatments.forEach((element, index) => {
        if (treatment == element) {
          delete this.newTreatments[index];
        }
      });
    }
  }
  // saveTreatmentToPatientByPharmacy() {
  //   if (this.patientDate.patientId && this.orders.length > 0) {
  //     const formData = new FormData();
  //     console.log(this.orders) ;
  //     formData.append('orders', JSON.stringify(this.orders));
  //     this.dashboard
  //       .addTreatmentToPatientByPharmacy(formData, this.patientDate.patientId)
  //       .subscribe((res) => {
  //         if (res) {
  //           alert('تم صرف الادوية لهذا المريض');
  //           this.treatments = res;
  //           this.orders = [] ;
  //         }
  //       });
  //   }
  // }

  setNewTreatment(event: Event, order: any) {
    const amount = +(event.target as HTMLInputElement).value;
    const oldOrder = this.orders.find((i) => i.ordersId === order.ordersId);
    if (!this.orders.includes(order) && oldOrder == undefined) {
      const newTotalSellPrice = amount * order.sellPrice;
      const newTotalbuyPrice = amount * order.buyPrice;
      if (amount > 0) {
        const conditionPrice = +newTotalSellPrice + +this.totalPrice;
        if (conditionPrice <= +this.patientDate.totalAmountNow) {
          this.totalPrice = +this.totalPrice + newTotalSellPrice;
          order.amount = amount;
          order.orderAmount = amount;
          order.totalBuyPrice = newTotalbuyPrice;
          order.totalSellPrice = newTotalSellPrice;
          order.totalPrice = +this.totalPrice;
          this.orders.push(order);
        } else {
          alert('سعر الكمية المضافة اكبر من المبلغ المتبقي');
        }
      } else {
        alert('الكمية اصغر من الواحد')
      }
    } else {
      const oldOrder = this.orders.find((i) => i.ordersId === order.ordersId);
      console.log('oldOrder ' + oldOrder);
      const newTotalSellPrice = amount * oldOrder.sellPrice;
      const newTotalbuyPrice = amount * oldOrder.buyPrice;
      if (amount > 0) {
        const conditionPrice = +newTotalSellPrice + +this.totalPrice;
        if (conditionPrice <= this.patientDate.totalAmountNow) {
          console.log(this.totalPrice);
          this.totalPrice =
            +oldOrder.totalPrice - +oldOrder.totalSellPrice + newTotalSellPrice;
          console.log('oldOrder.totalSellPrice ' + oldOrder.totalSellPrice);
          console.log('this.totalPrice ' + this.totalPrice);
          console.log('(oldOrder.totalPrice)' + oldOrder.totalPrice);
          console.log('totalPrice ' + this.totalPrice);
          oldOrder.amount = amount;
          oldOrder.orderAmount = amount;
          oldOrder.totalBuyPrice = newTotalbuyPrice;
          oldOrder.totalSellPrice = newTotalSellPrice;
          oldOrder.totalPrice = +this.totalPrice;
          this.orders = this.orders.splice(oldOrder, 1);
          this.orders.push(oldOrder);
          this.treatmentAmount = 0;
        } else {
          alert('سعر الكمية المضافة اكبر من المبلغ المتبقي');
        }
      } else {
        alert('الكمية اصغر من الواحد')
      }
      console.log(this.orders);
      console.log(this.totalPrice);
    }
  }

  saveTreatment(treatmentNam: Event) {
    const treatmentName = (treatmentNam.target as HTMLInputElement).value;
    if (treatmentName && this.patientDate.patientId) {
      const formData = new FormData();
      formData.append('treatmentName', JSON.stringify(this.treatmentName));
      formData.append('patient', JSON.stringify(this.patientDate));
      this.dashboard.addTreatmentToPatientByDoctor(formData).subscribe(
        (res) => {
          if (res) {
            this.getOrders();
            this.treatmentName = '';
            alert('تم الاضافة بنجاح');
          }
        },
        (err) => {
          console.log('العلاج ده اتضاف مرة ي ');
        }
      );
    }
  }
  getPatient() {
    this.patientDate = {};
    if (this.searchValue.length > 2) {
      const formData = new FormData();
      formData.append('patientName', JSON.stringify(this.searchValue));
      formData.append('decisionNumber', JSON.stringify(this.searchValue));
      this.dashboard
        .findPatientByNameOrDecisionNumber(formData)
        .subscribe((res) => {
          this.patientDate = res;
          this.getOrders();
          this.getMonthes();
          this.findSaleFormByPatientById();
        });
    }
    if (this.searchValue.length < 1) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['pharmacy']);
      });
    }
  }

  getOrders() {
    if (this.patientDate.patientId) {
      this.treatments = [];
      this.dashboard
        .findAllOrdersByPatientId(this.patientDate.patientName)
        .subscribe((res) => {
          if (res) {
            this.treatments = res;
          }
        });
    }
  }

  getTretmnet(treatment: any) {
    this.treatmentAmount = 0;
    if (treatment) {
      this.treatmentName = treatment.treatmentName;
      this.treatmentDate = treatment;
    }
  }

  getMonthes() {
    if (this.patientDate.patientId) {
      this.dashboard
        .findBillMonthsPatientById(this.patientDate.patientId)
        .subscribe((res) => {
          if (res) {
            this.months = res;
          }
        });
    }
  }

  getAllTreatments() {
    this.dashboard.findAllTreatments().subscribe((res) => {
      if (res) {
        res.forEach((element: any) => {
          this.treatmentsNames.push(element.treatmentName);
        });
      }
    });
  }

  findSaleFormByPatientById() {
    if (this.patientDate.patientId) {
      this.dashboard
        .findSaleFormByPatientById(this.patientDate.patientId)
        .subscribe((res) => {
          if (res) {
            console.log(res);
          }
        });
    }
  }
  addMore(treatment: any) {}

}
