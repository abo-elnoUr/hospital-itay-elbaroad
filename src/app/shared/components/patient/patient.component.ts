import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss'],
})
export class PatientComponent implements OnInit {
  subscription = new Subscription();
  patients: any[] = [];
  patientsNames: any[] = [];
  realDate: string = '';
  dateNow: Date = new Date();
  // diseaseCode = new FormControl('');
  disease: any = {};
  dataForm: FormGroup;
  patientData: any = {};
  patientObj: any = {};
  backendMonthes: any[] = [];
  monthNumber: any = 0;
  totalAmountBefor: number = 0;
  totalAmountNow: number = 0;
  totalAmountRest: number = 0;

  totalAmountNowt: number = 0;
  totalAmountRestt: number = 0;

  monthsBefor = new FormControl('');
  monthsAfter = new FormControl('');
  monthsAfterNow = new FormControl('');
  allMonthsBefor: any[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  allMonthsAfter: any[] = [];

  Data: any[] = [];
  previousMonthsData: any[] = [];

  dateFrom = new Date();
  searchValue: any;
  lastPatientObj: any = {};
  patientDataPrint: any = {
    patientName: '',
    decisionNumber: '',
    diseaseCode: '',
    statusType: '',
    decisionAmount: '',
    nationalId: '',
    parcodePhoto: '',
  };
  duration = 0;
  constructor(
    private _DatePipe: DatePipe,
    private fb: FormBuilder,
    private dashboardService: DashboardService,
    private router: Router
  ) {
    this.realDate =
      this._DatePipe.transform(this.dateNow, 'yyyy/MM/dd') || '{} ';

    this.dataForm = this.fb.group({
      statusType: new FormControl('انسولين', [Validators.required]),
      nationalId: new FormControl('', [Validators.required]),
      diagnosis: new FormControl('', [Validators.required]),
      decisionAmount: new FormControl('', [Validators.required]),
      decisionDuration: new FormControl('', [Validators.required]),
      clinicName: new FormControl('', [Validators.required]),
      totalAmount: new FormControl('', [Validators.required]),
      totalAmountBefor: new FormControl('', [Validators.required]),
      totalAmountNow: new FormControl('', [Validators.required]),
      totalAmountRest: new FormControl('', [Validators.required]),
      patientName: new FormControl('', [Validators.required]),
      patientCode: new FormControl('', [Validators.required]),
      decisionNumber: new FormControl('', [Validators.required]),
      diseaseCode: new FormControl('', [Validators.required]),
      billDateBefor: new FormControl('', [Validators.required]),
      billDateArter: new FormControl('', [Validators.required]),
    });
  }

  get dataFormValidate() {
    return this.dataForm.controls;
  }

  ngOnInit(): void {
    this.findAllPatients();
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
          : this.patientsNames
              .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
              .slice(0, 10)
      )
    );

  // حساب المبلغ المصروف مسبقا
  getTotalAmountBefor() {
    if (this.monthsBefor.value) {
      //عدد الشهور
      const monthNumber = +this.monthsBefor.value.length;
      // عدد الشهور اكبر من صفر و فيه اصلا مرض موجود او متضاف
      if (
        this.disease.decisionDuration > 0 &&
        this.disease.decisionAmount > 0 &&
        monthNumber > 0
      ) {
        // عدد الايام
        const days = monthNumber * 30;
        this.duration = days;
        // مدة القرار كلها مقسومة علي عدد الايام المصروفة
        const numDayes = +this.disease.decisionDuration / days;
        //حساب المبلغ المصروف مسبقا
        this.totalAmountBefor = +this.disease.decisionAmount / numDayes;
      } else {
        this.totalAmountBefor = 0;
      }
    }
  }

  //حساب المبلغ  المستح
  getTotalAmountAfter() {
    if (this.monthsAfter.value) {
      const monthNumber = +this.monthsAfter.value.length;
      if (
        this.disease.decisionDuration >= 0 &&
        this.disease.decisionAmount >= 0 &&
        monthNumber > 0
      ) {
        const days = +monthNumber * 30; //60
        const numDayes = +this.disease.decisionDuration / days; //180 - 60 / 60 = 2
        this.totalAmountNow = +this.disease.decisionAmount / numDayes; // 1200 - 400 = 800 / 2 = 400
      } else {
        this.totalAmountNow = 0;
      }
    }
  }
  //حساب المبلغ المستح و المبلغ المصروف مسبقا و المبلغ المتبقي
  // تسجيل المريض لاول مرة
  getTotalAmount() {
    this.getTotalAmountBefor();
    this.getTotalAmountAfter();
    if (this.totalAmountBefor > 0 && this.totalAmountNow > 0) {
      this.totalAmountRest =
        +this.disease.decisionAmount -
        (+this.totalAmountBefor + +this.totalAmountNow);
    }
    if (this.totalAmountBefor == 0 && this.totalAmountNow > 0) {
      this.totalAmountRest =
        +this.disease.decisionAmount - +this.totalAmountNow;
    }
  }

  getTotalAmountForUpdate() {
    this.getTotalAmountAfter();
    if (this.totalAmountBefor > 0 && this.totalAmountNow > 0) {
      this.totalAmountRest =
        +this.disease.decisionAmount -
        (+this.totalAmountBefor + +this.totalAmountNow);
    }
    if (this.totalAmountBefor == 0 && this.totalAmountNow > 0) {
      this.totalAmountRest =
        +this.disease.decisionAmount - +this.totalAmountNow;
    }
  }
  //عرض الشهور المتاحة بعد اختيار شهور الصرف السابقة
  //تسجيل المريض لاول مرة
  getMonthes() {
    if (this.monthsBefor.value) {
      this.allMonthsAfter = [];
      const allMonth: any[] = this.monthsBefor.value;
      if (allMonth.length > 0) {
        for (let index = 1; index < 13; index++) {
          const element = this.allMonthsBefor[index];
          const exist = allMonth[index];
          if (element != exist) {
            this.allMonthsAfter.push(element);
          }
        }
      } else {
        this.allMonthsAfter = this.allMonthsBefor;
      }
    } else {
      this.allMonthsAfter = this.allMonthsBefor;
    }
  }

  getBackEndMonthes() {
    if (this.monthsBefor.value) {
      this.monthsBefor.value.forEach((element: any) => {
        this.backendMonthes.push(element);
      });
    }

    if (this.monthsAfter.value) {
      this.monthsAfter.value.forEach((element: any) => {
        this.backendMonthes.push(element);
      });
    }

    if (
      this.monthsBefor.value.length == 0 &&
      this.monthsAfter.value.length == 0
    ) {
      this.backendMonthes = [];
    }
  }

  getBackEndMonthesForUpdate() {
    this.backendMonthes = [];
    if (this.monthsAfter.value != undefined || this.monthsBefor.value != null) {
      this.monthsAfter.value.forEach((element: any) => {
        this.backendMonthes.push(element);
      });
    }

    if (this.monthsAfter.value.length == 0) {
      this.backendMonthes = [];
    }
  }
  //تسجيل المريض للمرة الاولي
  save(data: FormGroup) {
    this.backendMonthes = [];
    this.getTotalAmount();
    this.getBackEndMonthes();
    if (this.disease.diseaseCode && this.backendMonthes.length > 0) {
      const formValue = data.value;
      formValue.diseaseCode = this.disease.diseaseCode;
      formValue.totalAmount = this.disease.decisionAmount;
      formValue.totalAmountBefor = this.totalAmountBefor + this.totalAmountNow;
      formValue.totalAmountNow = this.totalAmountNow;
      formValue.totalAmountRest = this.totalAmountRest;
      formValue.oldDecisionDuration =
        this.disease.decisionDuration - this.backendMonthes.length * 30;
      const formData = new FormData();
      formData.append('months', JSON.stringify(this.backendMonthes));
      formData.append('patient', JSON.stringify(formValue));
      this.subscription.add(
        this.dashboardService.savePatient(formData).subscribe(
          (res) => {
            if (res) {
              this.patientDataPrint = res;
              alert('تم تسجيل المريض بنجاح');
              this.patientData = {};
              this.disease = {};
              this.dataForm.reset();
              // this.monthsBefor.setValue('');
              // this.monthsAfter.setValue('');
              this.findAllPatients();
              this.allMonthsAfter = this.allMonthsBefor;
            }
          },
          (err) => {
            alert('هناك خطا في عملة التسجيل');
          }
        )
      );
    } else {
      alert('عدد الشهور المصروفة لا يساوي عدد الشهور المختارة');
    }
  }

  removeAllFields () {
    this.patientData = {};
    this.disease = {};
    this.dataForm.reset();
    // this.monthsBefor.setValue('');
    // this.monthsAfter.setValue('');
    this.findAllPatients();
    this.allMonthsAfter = this.allMonthsBefor;
  }
  reSave(data: FormGroup) {
    this.backendMonthes = [];
    this.getTotalAmountForUpdate();
    this.getBackEndMonthesForUpdate();
    if (data && this.disease.diseaseCode && this.backendMonthes.length > 0) {
      const formValue = data.value;
      this.patientObj.diseaseCode = this.disease.diseaseCode;
      this.patientObj.totalAmount = this.disease.decisionAmount;
      this.patientObj.totalAmountNow = this.totalAmountNow;
      this.patientObj.totalAmountRest = this.totalAmountRest;
      this.patientObj.oldDecisionDuration =
        this.disease.decisionDuration - this.backendMonthes.length * 30;
      this.patientObj.statusType = formValue.statusType;
      this.patientObj.nationalId = formValue.nationalId;
      this.patientObj.diagnosis = formValue.diagnosis;
      this.patientObj.decisionAmount = formValue.decisionAmount;
      this.patientObj.decisionDuration = formValue.decisionDuration;
      this.patientObj.clinicName = formValue.clinicName;
      this.patientObj.patientName = formValue.patientName;
      this.patientObj.patientCode = formValue.patientCode;
      this.patientObj.decisionNumber = formValue.decisionNumber;
      const formData = new FormData();
      formData.append('months', JSON.stringify(this.backendMonthes));
      formData.append('patient', JSON.stringify(this.patientObj));
      this.subscription.add(
        this.dashboardService.updatePatient(formData).subscribe(
          (res) => {
            if (res) {
              this.patientDataPrint = res;
              alert('تم تسجيل المريض بنجاح');
              this.patientData = {};
              this.disease = {};
              this.dataForm.reset();
              this.monthsBefor.reset();
              this.monthsAfter.reset();
              this.findAllPatients();
              this.allMonthsAfter = this.allMonthsBefor;
            }
          },
          (err) => {
            alert('هناك خطا في عملة التسجيل');
          }
        )
      );
    } else {
      alert('عدد الشهور المصروفة لا يساوي عدد الشهور المختارة');
    }
  }

  //حساب المبلغ المستحق للصرف و المبلغ الباقي
  // المريض موجود مسبقا
  getTotalAmountNow() {
    if (this.monthsAfterNow.value) {
      const monthNumber = +this.monthsAfterNow.value.length;
      if (this.patientData.totalAmount >= 0 && monthNumber > 0) {
        const days = +monthNumber * 30;
        const numDayes = this.patientData.oldDecisionDuration / days;
        this.totalAmountNowt = +this.patientData.totalAmountRest / numDayes;
        this.totalAmountRestt =
          +this.patientData.totalAmountRest - +this.totalAmountNowt;
      } else {
        this.totalAmountNow = 0;
      }
    }
  }
  //اضافة شهور الصرف الجديده للمريض
  update() {
    // this.patientObj.oldDecisionDuration =
    //   this.patientObj.decisionDuration - this.monthsAfterNow.value.length * 30;
    if (
      this.patientObj.oldDecisionDuration >= 0 &&
      this.totalAmountRestt >= 0 &&
      this.monthsAfterNow.value.length > 0
    ) {
      this.patientObj.totalAmountBefor =
        this.patientObj.totalAmountBefor + this.totalAmountNowt;
      this.patientObj.totalAmountNow = this.totalAmountNowt;
      this.patientObj.totalAmountRest = this.totalAmountRestt;
      this.patientObj.oldDecisionDuration =
        this.patientObj.oldDecisionDuration -
        this.monthsAfterNow.value.length * 30;
      const formData = new FormData();
      formData.append('months', JSON.stringify(this.monthsAfterNow.value));
      formData.append('patient', JSON.stringify(this.patientObj));
      this.subscription.add(
        this.dashboardService.updatePatient(formData).subscribe(
          (res) => {
            if (res) {
              this.patientData = {};
              this.patientObj = {};
              alert('تم تسجيل المريض بنجاح');
              this.dataForm.reset();
              this.monthsBefor.reset();
              this.monthsAfter.reset();
              this.monthsAfterNow.reset();
            }
          },
          (err) => {
            alert('هناك خطا في عملة التسجيل');
          }
        )
      );
    } else {
      alert('عليك اختيار شهور الصرف اولا');
    }
  }

  //عرض الشهور المتاحة الباقية للصرف
  PreviousMonthes() {
    if (this.previousMonthsData.length > 0) {
      this.allMonthsAfter = [];
      const allExistsMonth: any[] = this.previousMonthsData;
      if (allExistsMonth.length > 0) {
        for (let index = 1; index < 13; index++) {
          const element = this.allMonthsBefor[index];
          const exist = allExistsMonth[index];
          if (element != exist) {
            this.allMonthsAfter.push(element);
          }
        }
      }
    }
  }

  //شهور الصرف السابقة
  getPatientPreviousMonthes() {
    this.previousMonthsData = [];
    if (this.patientData.patientId) {
      this.subscription.add(
        this.dashboardService
          .findBillMonthsPatientById(this.patientData.patientId)
          .subscribe((res) => {
            if (res) {
              res.forEach((element: any) => {
                this.previousMonthsData.push(element.monthNumber);
              });
            }
          })
      );
    }
  }
  updatePatient(dataForm: FormGroup) {}

  delete(id: any) {
    if (confirm('هل انت متأكد من الحذف ؟؟')) {
      this.subscription.add(
        this.dashboardService.deletePatient(id).subscribe((res) => {
          if (res) {
            this.patientData = {};
            this.patientObj = {};
            alert('تم حذف هذا المريض بنجاح');
          }
        })
      );
    }
  }

  // البحث عن المريض من خلال رقم القرار او الاسم
  getPatient() {
    if (this.searchValue.length > 2 && this.patients.length > 0) {
      this.patientData = this.patients.find(
        (item) =>
          item.decisionNumber == this.searchValue ||
          item.patientName == this.searchValue ||
          item.nationalId == this.searchValue
      );
      this.patientObj = this.patientData;
      if (this.patientData) {
        this.getPatientPreviousMonthes();
        this.dataForm.patchValue(this.patientData);
      }
    }
    if (this.searchValue.length <= 0) {
      this.patientData = {};
      this.disease = {};
      this.dataForm.reset();
      this.patients = [];
      this.subscription.add(
        this.dashboardService.findAllPatients().subscribe((res) => {
          if (res) {
            this.patients = res;
          }
        })
      );
    }
  }

  findAllPatient() {
    if (this.dateFrom) {
      this.patients = [];
      this.patientsNames = [];
      this.subscription.add(
        this.dashboardService.findAllPatient().subscribe((res) => {
          this.patients = res;
          res.forEach((element: { patientName: any }) => {
            this.patientsNames.push(element.patientName);
          });
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
        this.dashboardService
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

  //كل المرضي الموجودين
  findAllPatients() {
    this.patients = [];
    this.patientsNames = [];
    this.subscription.add(
      this.dashboardService.findAllPatients().subscribe((res) => {
        if (res) {
          res.forEach((element: { patientName: any }) => {
            this.patientsNames.push(element.patientName);
          });
          this.lastPatientObj = res[res.length - 1];
          this.patients = res;
        }
      })
    );
  }
  // اختيار نوع المرض من خلال البحث بكود المرض
  getDiseaseByCode(event: Event) {
    const diseaseCode = (event.target as HTMLInputElement).value;
    if (diseaseCode.length > 2) {
      const formData = new FormData();
      formData.append('diseaseCode', JSON.stringify(diseaseCode));
      this.subscription.add(
        this.dashboardService.getDiseaseByCode(formData).subscribe((res) => {
          if (res) {
            this.disease = res;
            this.dataForm.patchValue(res);
          } else {
            alert('لا يوجد كود مرض بهذا الرقم');
          }
        })
      );
    } else {
      this.disease = {};
    }
  }
  getPatientBySelected(event: any) {
    this.searchValue = event.target.value;
    this.getPatient();
  }
  getLastPatient() {
    this.searchValue = this.lastPatientObj.decisionNumber;
    this.getPatient();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
