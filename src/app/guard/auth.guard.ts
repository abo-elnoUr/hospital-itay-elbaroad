import { Injectable, OnInit } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivate,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  currentUser: any;
  manager: any;
  user: any;
  admin: any;
  constructor(private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    if (
      localStorage.getItem('currentUser') &&
      (localStorage.getItem('role') === JSON.stringify('USER') ||
        localStorage.getItem('role') === JSON.stringify('ADMIN'))
    ) {
      return true;
    } else {
      alert('من فضلك سجل الدخول');
      this.router.navigate(['/login']);
      return false;
    }
  }
}
