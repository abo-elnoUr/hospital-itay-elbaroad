import { AllSaleFormsComponent } from './shared/components/all-sale-forms/all-sale-forms.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './shared/components/login/login.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { PatientComponent } from './shared/components/patient/patient.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { PharmacyComponent } from './shared/components/pharmacy/pharmacy.component';
import { DoctorComponent } from './shared/components/doctor/doctor.component';
import { PharmacyIncomeComponent } from './shared/components/pharmacy-income/pharmacy-income.component';
import { PharmacyBalanceComponent } from './shared/components/pharmacy-balance/pharmacy-balance.component';
import { ReportComponent } from './shared/components/report/report.component';
import { DiseasComponent } from './shared/components/diseas/diseas.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { RegisterComponent } from './shared/components/register/register.component';
import { PatientsComponent } from './shared/components/patients/patients.component';
import { DoctorGuard } from './guard/doctor.guard';
import { SaleFormsComponent } from './shared/components/sale-forms/sale-forms.component';
import { BankStatementComponent } from './shared/components/bank-statement/bank-statement.component';
import { MonthlyClaimsComponent } from './shared/components/monthly-claims/monthly-claims.component';
import { TreatmentRegisterationComponent } from './shared/components/treatment-registeration/treatment-registeration.component';
import { PharmacyGuard } from './guard/pharmacy.guard';

// const routes: Routes = [
//   { path: '', redirectTo: '/', pathMatch: 'full' },
//   { path: '', component: HomeComponent },
//   { path: 'navbar', component: NavbarComponent },
//   { path: 'login', component: LoginComponent },
//   { path: 'registration', component: RegisterComponent, canActivate: [PharmacyGuard] },
//   { path: 'patient', component: PatientComponent, canActivate: [PharmacyGuard] },
//   { path: 'patients', component: PatientsComponent, canActivate: [AuthGuard] },
//   { path: 'pharmacy', component: PharmacyComponent, canActivate: [AuthGuard] },
//   { path: 'allSaleForms', component: AllSaleFormsComponent },
//   { path: 'saleForms', component: SaleFormsComponent, canActivate: [AuthGuard] },
//   { path: 'bank-statement/:decisionNumber/:patientName', component: BankStatementComponent },
//   { path: 'monthlyClaims', component: MonthlyClaimsComponent, canActivate: [AuthGuard] },
//   { path: 'pharmacy/:patientId', component: PharmacyComponent, canActivate: [AuthGuard] },
//   { path: 'doctor', component: DoctorComponent, canActivate: [DoctorGuard] },
//   { path: 'doctorList/:patientId', component: DoctorComponent, canActivate: [AuthGuard] },
//   { path: 'disese', component: DiseasComponent, canActivate: [AuthGuard] },
//   { path: 'pharmacy-income', component: PharmacyIncomeComponent, canActivate: [AuthGuard] },
//   { path: 'pharmacy-balance', component: PharmacyBalanceComponent, canActivate: [AuthGuard] },
//   { path: 'report', component: ReportComponent, canActivate: [AuthGuard] },
//   { path: 'treatment-registeration', component: TreatmentRegisterationComponent, canActivate: [AuthGuard] },
//   { path: '**', redirectTo: '/', pathMatch: 'full' },
// ];

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  { path: '', component: HomeComponent },
  { path: 'navbar', component: NavbarComponent },
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterComponent },
  { path: 'patient', component: PatientComponent },
  { path: 'patients', component: PatientsComponent },
  { path: 'pharmacy', component: PharmacyComponent },
  { path: 'allSaleForms', component: AllSaleFormsComponent },
  { path: 'saleForms', component: SaleFormsComponent },
  { path: 'bank-statement/:decisionNumber/:patientName', component: BankStatementComponent },
  { path: 'monthlyClaims', component: MonthlyClaimsComponent },
  { path: 'pharmacy/:patientId', component: PharmacyComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'doctorList/:patientId', component: DoctorComponent },
  { path: 'disese', component: DiseasComponent },
  { path: 'pharmacy-income', component: PharmacyIncomeComponent },
  { path: 'pharmacy-balance', component: PharmacyBalanceComponent },
  { path: 'treatment-registeration', component: TreatmentRegisterationComponent },
  { path: 'report', component: ReportComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
