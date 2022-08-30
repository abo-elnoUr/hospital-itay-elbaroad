import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'app-pharmacy-income',
  templateUrl: './pharmacy-income.component.html',
  styleUrls: ['./pharmacy-income.component.scss'],
})
export class PharmacyIncomeComponent implements OnInit {
  subscription = new Subscription();
  treatments: any[] = [];
  treatmentsNames: any[] = [];
  treatmentName: any;
  realDate: string = '';
  dateNow: Date = new Date();
  buyPrice: any;
  sellPrice: any;
  percentage: any;
  treatmentData: any = {};
  searchValue: String = '';
  constructor(
    private _DatePipe: DatePipe,
    private dashboardService: DashboardService
  ) {
    this.realDate =
      this._DatePipe.transform(this.dateNow, 'yyyy/MM/dd') || '{} ';
  }

  dataForm = new FormGroup({
    treatmentName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    treatmentAmount: new FormControl('', [Validators.required]),
    buyPrice: new FormControl('', [Validators.required]),
    sellPrice: new FormControl(''),
    createdDate: new FormControl(''),
    updatedDate: new FormControl(''),
    updateMinValue: new FormControl(''),
    updateMaxValue: new FormControl(''),
    percentage: new FormControl('12'),
    notes: new FormControl('لا يوجد	'),
  });

  get dataFormValidate() {
    return this.dataForm.controls;
  }

  ngOnInit(): void {
    this.getTreatments();
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

  searchTreatments: OperatorFunction<string, readonly string[]> = (
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

  getSearchedTreatmentByName() {
    if (this.searchValue.length > 1 && this.treatments.length > 0) {
      this.treatmentData = this.treatments.find(
        (item) => item.treatmentName == this.searchValue
      );
      if (this.treatmentData.treatmentName) {
        this.dataForm.patchValue(this.treatmentData);
      }
    }
  }

  getTreatmentByName(treatmentName: any) {
    if (treatmentName.item) {
      const formData = new FormData();
      formData.append('treatmentName', JSON.stringify(treatmentName.item));
      this.subscription.add(
        this.dashboardService.getTreatmentByName(formData).subscribe((res) => {
          if (res) {
            this.dataForm.patchValue(res);
            this.treatmentData = res;
          }
        })
      );
    }
  }

  getSellPrice() {
    if (this.buyPrice > 0) {
      let sellValue: any;
      if (this.percentage == 14) {
        sellValue = this.buyPrice * 0.14;
      }
      if (this.percentage == 12) {
        sellValue = this.buyPrice * 0.12;
      }
      this.sellPrice = sellValue + this.buyPrice;
    } else {
      this.sellPrice = '';
    }
  }
  getPercentage(value: any) {
    this.percentage = value.target.value;
    this.buyPrice = null;
    this.sellPrice = null;
  }

  getTreatments() {
    this.subscription.add(
      this.dashboardService.findAllTreatments().subscribe((res) => {
        if (res) {
          res.forEach((element: any) => {
            this.treatments.push(element);
            this.treatmentsNames.push(element.treatmentName);
          });
        }
      })
    );
  }
  update(data: any) {
    if (data) {
      this.dataForm.patchValue(data);
      this.treatmentData = data;
    }
  }
  delete(id: any) {
    this.subscription.add(
      this.dashboardService.deleteTreatment(id).subscribe((res) => {})
    );
  }
  save(dataForm: FormGroup) {
    if (this.dataForm.valid) {
      const formValue = dataForm.value;
      formValue.sellPrice = this.sellPrice;
      this.subscription.add(
        this.dashboardService.savePharmacy(formValue).subscribe((res) => {
          if (res) {
            this.treatments = [];
            alert('تم ادخال العلاج بنجاح');
            res.forEach((element: any) => {
              this.treatments.push(element);
              dataForm.reset();
            });
          }
        })
      );
    }
  }
  edit(dataForm: FormGroup) {
    if (this.dataForm.valid) {
      this.getSellPrice();
      const formValue = dataForm.value;
      if (this.sellPrice > 0) {
        formValue.sellPrice = this.sellPrice;
      }
      formValue.treatmentId = this.treatmentData.treatmentId;
      this.subscription.add(
        this.dashboardService.updatePharmacy(formValue).subscribe((res) => {
          if (res) {
            this.treatments = [];
            alert('تم تعديل العلاج بنجاح');
            res.forEach((element: any) => {
              this.treatments.push(element);
              dataForm.reset();
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
