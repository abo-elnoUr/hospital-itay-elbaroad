import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.component.html',
  styleUrls: ['./doctor.component.scss'],
})
export class DoctorComponent implements OnInit {
  subscription = new Subscription();
  treatements: any[] = [];
  patientId: any;
  patientDate: any = {};
  treatmentDate: any = {};
  treatmentName: any;
  months: any[] = [];
  searchValue: any;
  treatmentsNames: any[] = [];
  treatments: any[] = [];
  patients: Array<any> = [];
  dateFrom = new Date();
  patientsNames: any[] = [];
  constructor(
    private dashboard: DashboardService,
    private rout: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllTreatments();
    this.getAllOrders();
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

  getAllOrders() {
    if (this.patientDate.patientId) {
      this.treatements = [];
      this.subscription.add(
        this.dashboard
          .findAllOrdersByPatientId(this.patientDate.patientName)
          .subscribe((res) => {
            if (res) {
              this.treatments = res;
            }
          })
      );
    }
  }
  getTretmnet(treatment: any) {
    if (treatment) {
      this.treatmentName = treatment;
      this.getTreatmentByName();
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

  getPatientBySelected(event: any) {
    this.searchValue = event.target.value;
    this.treatements = [];
    this.getPatient();
  }

  saveTreatment() {
    if (this.treatmentName && this.patientDate.patientId) {
      const formData = new FormData();
      formData.append('treatmentName', JSON.stringify(this.treatmentName));
      formData.append('patient', JSON.stringify(this.patientDate));
      this.subscription.add(
        this.dashboard.addTreatmentToPatientByDoctor(formData).subscribe(
          (res) => {
            if (res) {
              this.getAllOrders();
              this.treatmentName = '';
              alert('تم الاضافة بنجاح');
            }
          },
          (err) => {
            console.log('العلاج ده اتضاف مرة ');
          }
        )
      );
    }
  }

  updateTreatment() {
    if (this.treatmentName && this.patientDate.patientId) {
      const formData = new FormData();
      formData.append('treatmentName', JSON.stringify(this.treatmentName));
      formData.append(
        'treatmentId',
        JSON.stringify(this.treatmentDate.treatmentId)
      );
      formData.append('patient', JSON.stringify(this.patientDate));
      this.subscription.add(
        this.dashboard.updateTreatmentToPatientByDoctor(formData).subscribe(
          (res) => {
            if (res) {
              this.getAllOrders();
              this.treatmentName = '';
              alert('تم التعديل بنجاح');
            }
          },
          (err) => {
            console.log(err);
          }
        )
      );
    }
  }
  getTreatmentByName() {
    if (this.treatmentName) {
      const formData = new FormData();
      formData.append('treatmentName', JSON.stringify(this.treatmentName));
      this.subscription.add(
        this.dashboard.getTreatmentByName(formData).subscribe((res) => {
          if (res) {
            this.treatmentDate = res;
            this.treatmentName = null;
          }
        })
      );
    }
  }
  getAllTreatments() {
    this.subscription.add(
      this.dashboard.findAllTreatments().subscribe((res) => {
        if (res) {
          res.forEach((element: any) => {
            this.treatmentsNames.push(element.treatmentName);
          });
        }
      })
    );
  }

  deleteOrder(id: any) {
    if (confirm('?هل انت متأكد من حذف هذا الدواء من القائمة')) {
      this.subscription.add(
        this.dashboard.deleteOrder(id).subscribe((res) => {
          if (res) {
            this.getAllOrders();
            alert('تم حذف هذا الدواء من القائمة بنجاح');
          }
        })
      );
    }
  }

  // البحث عن المريض من خلال رقم القرار او الاسم
  getPatient() {
    if (this.searchValue.length > 2 && this.patients.length > 0) {
      this.patientDate = this.patients.find(
        (item) =>
          item.decisionNumber == this.searchValue ||
          item.patientName == this.searchValue ||
          item.nationalId == this.searchValue
      );
      if (this.patientDate) {
        this.getAllOrders();
        this.getMonthes();
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

  findAllPatients() {
    this.patients = [] ;
    this.patientsNames = [] ;
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
