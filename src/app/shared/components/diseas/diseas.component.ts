import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DatePipe, formatDate } from '@angular/common';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'app-diseas',
  templateUrl: './diseas.component.html',
  styleUrls: ['./diseas.component.scss'],
})
export class DiseasComponent implements OnInit {
  subscription = new Subscription();
  diseases: any[] = [];
  diseaseDate: any = {};
  realDate: string = '';
  dateNow: Date = new Date();
  diseaseCodes: any[] = [];
  searchValue: String = '';
  constructor(
    private _DatePipe: DatePipe,
    private dashboardService: DashboardService
  ) {
    this.realDate =
      this._DatePipe.transform(this.dateNow, 'yyyy/MM/dd') || '{} ';
  }

  dataForm = new FormGroup({
    diseaseCode: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
    diagnosis: new FormControl(''),
    decisionAmount: new FormControl(''),
    decisionDuration: new FormControl(''),
    clinicName: new FormControl('مستشفي ايتاي البارود'),
  });

  get dataFormValidate() {
    return this.dataForm.controls;
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
          : this.diseaseCodes
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );
  ngOnInit(): void {
    this.getDiseases();
  }

  getDiseasByCode() {
    if (this.searchValue.length > 1 && this.diseases.length > 0) {
      this.diseaseDate = this.diseases.find(
        (item) => item.diseaseCode == this.searchValue
      );
      if (this.diseaseDate.diseaseCode) {
        this.dataForm.patchValue(this.diseaseDate);
      }
    }
  }
  getDiseases() {
    this.diseaseCodes = [];
    this.subscription.add(
      this.dashboardService.findAllDiseases().subscribe((res) => {
        if (res) {
          this.diseases = res;
          res.forEach((element: any) => {
            this.diseaseCodes.push(element.diseaseCode);
          });
        }
      })
    );
  }
  save(dataForm: FormGroup) {
    if (this.dataForm.valid) {
      this.subscription.add(
        this.dashboardService.saveDisease(dataForm.value).subscribe((res) => {
          if (res) {
            alert('... تم حفظ كود المرض بنجاح ..');
            this.diseases.push(res);
            dataForm.reset();
          } else {
            alert('يوجد مشكلة في عملية الحفظ');
          }
        })
      );
    }
  }
  update(dataForm: any) {
    if (dataForm.valid) {
      dataForm.value.diseaseId = this.diseaseDate.diseaseId;
      this.subscription.add(
        this.dashboardService.updateDisease(dataForm.value).subscribe((res) => {
          if (res) {
            alert('... تم التعديل كود المرض بنجاح ..');
            this.diseases = [] ;
            this.getDiseases();
            this.searchValue = '';
            this.dataForm.reset();
          } else {
            alert('يوجد مشكلة في عملية التعديل');
          }
        })
      );
    }
  }

  deleteDisease(id: any) {
    if (confirm('هل انت متأكد من الحذف ؟؟')) {
      this.subscription.add(
        this.dashboardService.deleteDisease(id).subscribe((res) => {
          if (res) {
            this.diseaseDate = {};
            this.diseases = [] ;
            this.getDiseases()
            alert('تم حذف هذا الكود بنجاح');
          }
        })
      );
    }
  }
  getDisease(disease: any) {
    this.diseaseDate = disease;
    this.dataForm.patchValue(disease);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
