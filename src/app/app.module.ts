import { PharmacyGuard } from './guard/pharmacy.guard';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ToastrModule } from "ngx-toastr";
import { SearchPipe } from './shared/pipes/search.pipe';
import { DatePipe } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { LoginComponent } from './shared/components/login/login.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PatientComponent } from './shared/components/patient/patient.component';
import { PharmacyComponent } from './shared/components/pharmacy/pharmacy.component';
import { DoctorComponent } from './shared/components/doctor/doctor.component';
import { PharmacyIncomeComponent } from './shared/components/pharmacy-income/pharmacy-income.component';
import { PharmacyBalanceComponent } from './shared/components/pharmacy-balance/pharmacy-balance.component';
import { ReportComponent } from './shared/components/report/report.component';
import { DashboardService } from './service/dashboard.service';
import { DiseasComponent } from './shared/components/diseas/diseas.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from './shared/components/register/register.component';
import { UserService } from './service/user.service';
import { AuthGuard } from './guard/auth.guard';
import { AdminGuard } from './guard/admin.guard';
import { PatientsComponent } from './shared/components/patients/patients.component';
import { ExcelService } from './service/excel.service';
import { DoctorGuard } from './guard/doctor.guard';
import { PharmacyDataComponent } from './shared/components/pharmacy-data/pharmacy-data.component';
import { SaleFormsComponent } from './shared/components/sale-forms/sale-forms.component';
import { BankStatementComponent } from './shared/components/bank-statement/bank-statement.component';
import { MonthlyClaimsComponent } from './shared/components/monthly-claims/monthly-claims.component';
import { NgxPrintModule } from 'ngx-print';
import { TreatmentRegisterationComponent } from './shared/components/treatment-registeration/treatment-registeration.component';
import { AllSaleFormsComponent } from './shared/components/all-sale-forms/all-sale-forms.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NotFoundComponent,
    NavbarComponent,
    LoginComponent,
    SearchPipe,
    PatientComponent,
    PharmacyComponent,
    DoctorComponent,
    PharmacyIncomeComponent,
    PharmacyBalanceComponent,
    ReportComponent,
    DiseasComponent,
    RegisterComponent,
    PatientsComponent,
    PharmacyDataComponent,
    SaleFormsComponent,
    BankStatementComponent,
    MonthlyClaimsComponent,
    TreatmentRegisterationComponent,
    AllSaleFormsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 1000,
      progressBar: true,
      closeButton: true,
      tapToDismiss: true,
      preventDuplicates: true
    }),
    NgxPaginationModule,
    NgbModule,
    NgxPrintModule
  ],
  providers: [
    DatePipe,
    DashboardService,
    UserService,
    AuthGuard,
    AdminGuard,
    PharmacyGuard,
    DoctorGuard,
    ExcelService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
