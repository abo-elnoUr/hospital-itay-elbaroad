import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private subject = new Subject<any>() ;
  constructor(private userService: UserService) {}

  isLoggedIn() {
    if (localStorage.getItem('currentUser') && localStorage.getItem('koko')) {
      return true ;
    } else {
      return false ;
    }
  }
  // clearStatus() {
  //   this.subject.next() ;
  // }
  getStatus(): Observable<any> {
    return this.subject.asObservable() ;
  }
}
