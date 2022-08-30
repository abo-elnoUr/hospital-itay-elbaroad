import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string;
  constructor(private http: HttpClient) {
    this.http = http;
    if (isDevMode()) {
      this.url = environment.API_URL_Front+ '/api/';
    } else {
      this.url = environment.API_URL_Back+ '/api/';
    }
  }

  signup(data: any): Observable<any> {
    const headers = new HttpHeaders({'Access-Control-Allow-Origin' : '*'}) ;
    return this.http.post(this.url + 'signup' , data , {headers}) ;
  }

  loginUsers(user: any): Observable<any> {
    const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'}) ;
    return this.http.post(this.url + 'login' , user , {headers}) ;
  }

  getUsers(token: string): Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token}) ;
    return this.http.get(this.url + 'getUsers' , {headers}) ;
  }
  getUser(token: string): Observable<any> {
    const headers = new HttpHeaders({'Authorization': 'Bearer ' + token}) ;
    return this.http.get(this.url + 'getUser' , {headers}) ;
  }
  getUserById(id: any): Observable<any> {
    const headers = new HttpHeaders({'Access-Control-Allow-Origin': '*'}) ;
    return this.http.get(this.url + 'findUserById/' + id , {headers}) ;
  }
}
