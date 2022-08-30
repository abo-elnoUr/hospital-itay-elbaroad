import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (
      localStorage.getItem('currentUser') &&
      (localStorage.getItem('role') == JSON.stringify('MANAGER') ||
        localStorage.getItem('role') == JSON.stringify('ADMIN') ||
        localStorage.getItem('role') == JSON.stringify('USER') ||
        localStorage.getItem('role') == JSON.stringify('DOCTOR'))
    ) {
      console.log(localStorage.getItem('role'))
      return true;
    } else {
      alert('من فضلك هذا القسم غير متاح لهذا المستخدم ');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
