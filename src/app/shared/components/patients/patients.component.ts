import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';
import { ExcelService } from 'src/app/service/excel.service';
import { Observable, OperatorFunction, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss'],
})
export class PatientsComponent implements OnInit {
  subscription = new Subscription();
  patients: any[] = [];
  patientDate: any = {};
  dateFrom = new FormControl('');
  patientsNames: any[] = [];
  searchValue: any;
  constructor(
    private dashboardService: DashboardService,
    private excelService: ExcelService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.findAllPatients();
  }
  exportexcel(): void {
    /* pass here the table id */
    let element = document.getElementById('excel-table');
    this.excelService.exportexcel(element, ' HG');
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
  // البحث عن المريض من خلال رقم القرار او الاسم
  getPatient() {
    if (this.searchValue.length > 1 && this.patients.length > 0) {
      this.patients = this.patients.filter(
        (item) =>
        item.decisionNumber == this.searchValue ||
        item.patientName == this.searchValue ||
        item.nationalId == this.searchValue
      );
    } else {
      this.findAllPatients() ;
    }

  }
  getPatientsByDay() {
    if (this.dateFrom) {
      this.patients = [] ;
    this.patientsNames = [] ;
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

  delete(id: any) {
    if (confirm('هل انت متأكد من الحذف ؟؟')) {
      this.subscription.add(
        this.dashboardService.deletePatient(id).subscribe((res) => {
          if (res) {
            this.patients = res;
            alert('تم حذف هذا المريض بنجاح');
          }
        })
      );
    }
  }

  deleteAll() {
    if (confirm('هل انت متأكد من الحذف ؟؟')) {
      this.dashboardService.deleteAllPatients().subscribe();
      alert('تم حذف جميع المرضي');
    }
  }
  findAllPatients() {
    this.patients = [] ;
    this.patientsNames = [] ;
    this.subscription.add( this.dashboardService.findAllPatient().subscribe((res) => {
      if (res) {
        this.patients = res;
        res.forEach((element: { patientName: any }) => {
          this.patientsNames.push(element.patientName);
        });
      }
    }));
  }

  getPatientBySelected(event: any) {
    this.searchValue = event.target.value;
    this.getPatient();

  }
  showBankStatement(decisionNumber: any , patientName: any) {
    this.router.navigate(['bank-statement/' + decisionNumber + '/' + patientName]);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
