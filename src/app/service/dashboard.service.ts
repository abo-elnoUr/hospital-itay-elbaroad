import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  url: string;
  constructor(private http: HttpClient) {
    this.http = http;
    if (isDevMode()) {
      this.url = environment.API_URL_Front+ '/api/';
    } else {
      this.url = environment.API_URL_Back+ '/api/';
    }
  }
  savePharmacy(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'savePharmacy', data, { headers });
  }
  updatePharmacy(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'updatePharmacy', data, { headers });
  }
  loginUsers(user: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'login', user, { headers });
  }

  findAllPharmacys(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findAllPharmacys', { headers });
  }
  getUserById(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findUserById/' + id, { headers });
  }

  //treatments
  findAllTreatments(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findAllTreatments', { headers });
  }
  deleteTreatment(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'deleteTreatment/' + id, { headers });
  }

  deletePharmacy(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'deletePharmacy/' + id, { headers });
  }
  findAllDiseases(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findAllDiseases', { headers });
  }
  saveDisease(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'saveDisease', data, { headers });
  }
  deleteDisease(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'deleteDisease/' + id, { headers });
  }
  updateDisease(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'updateDisease', data, { headers });
  }

  findAllPatients(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findAllPatients', { headers });
  }

  findAllPatient(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findAllPatient', { headers });
  }
  findAllPatientsByCreatedDate(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'findAllPatientsByCreatedDate', data, {
      headers,
    });
  }
  savePatient(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'savePatient', data, { headers });
  }

  updatePatient(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'updatePatient', data, { headers });
  }
  findAllPatentsFromTo(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'findAllPatentsFromTo', data, { headers });
  }
  findSaleFormByPatientById(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findSaleFormByPatientById/' + id, {
      headers,
    });
  }

  findPatientById(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findPatientById/' + id, { headers });
  }
  deleteOrder(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'deleteOrders/' + id, { headers });
  }
  findBillMonthsPatientById(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findBillMonthsPatientById/' + id, {
      headers,
    });
  }
  getDiseaseByCode(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'getDiseaseByCode', data, { headers });
  }
  getTreatmentByName(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'getTreatmentByName', data, { headers });
  }

  addTreatmentToPatientByDoctor(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'addTreatmentToPatientByDoctor', data, {
      headers,
    });
  }
  addTreatmentToPatientByPharmacy(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'addTreatmentToPatientByPharmacy', data, {
      headers,
    });
  }
  findPatientByNameOrDecisionNumber(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'findPatientByNameOrDecisionNumber',
      data,
      { headers }
    );
  }
  getTreatmentsByPatientId(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'getTreatmentsByPatientId/' + id, {
      headers,
    });
  }

  findOrdersByPatientId(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findOrdersByPatientId/' + id, { headers });
  }
  findAllTreatmentsFromTo(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'findAllTreatmentsFromTo', data, {
      headers,
    });
  }

  updateTreatmentToPatientByDoctor(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'updateTreatmentToPatientByDoctor', data, {
      headers,
    });
  }

  findAllOrdersByPatientId(name: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findAllOrdersByPatientId/' + name, {
      headers,
    });
  }
  deleteAllPatients(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'deleteAllPatients', { headers });
  }
  deletePatient(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'deletePatient/' + id, { headers });
  }

  setRestEqualAmount(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'setRestEqualAmount', { headers });
  }

  findAllMonthlyClames(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'findAllMonthlyClames', data, { headers });
  }
  getPatientSalesForms(name: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'getPatientSalesForms', name, { headers });
  }

  getPatientNameReports(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'getPatientNameReports', { headers });
  }

  findAllSaleFormTimes(): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findAllSaleFormTimes', { headers });
  }

  findAllBySaleFormSaleFormId(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'findAllBySaleFormSaleFormId/' + id, {
      headers,
    });
  }

  updateOrders(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'updateOrders',
      data,
      { headers }
    );
  }
  deleteAllBySaleFormSaleFormId(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'deleteAllBySaleFormSaleFormId/' + id, {
      headers,
    });
  }
  deleteSaleFormTimeById(id: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(this.url + 'deleteSaleFormTimeById/' + id, {
      headers,
    });
  }
  findAllSalesTimesByDecisionNumber(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'findAllSalesTimesByDecisionNumber',
      data,
      { headers }
    );
  }

  findAllBySaleFormCreatedDateFromTo(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'findAllBySaleFormCreatedDateFromTo',
      data,
      { headers }
    );
  }

  findAllBySalesFormTimesCreatedDateFromTo(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'findAllBySalesFormTimesCreatedDateFromTo',
      data,
      { headers }
    );
  }

  findAllSalesFormsPrint(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'findAllSalesFormsPrint',
      data,
      { headers }
    );
  }
  findAllTreatmentReports(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(this.url + 'findAllTreatmentReports', data, {
      headers,
    });
  }

  findAllTreatmentRegisterationByDate(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'findAllTreatmentRegisterationByDate',
      data,
      { headers }
    );
  }

  findAllSalesFormsByDiagnosis(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'findAllSalesFormsByDiagnosis',
      data,
      { headers }
    );
  }

  findAllSalesFormsByPatientName(data: any): Observable<any> {
    const headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.post(
      this.url + 'findAllSalesFormsByPatientName',
      data,
      { headers }
    );
  }
}
