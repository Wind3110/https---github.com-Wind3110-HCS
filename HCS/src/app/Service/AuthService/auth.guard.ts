import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let url: string = state.url;
    return this.verifyLogin(url);
  }

  verifyLogin(url): boolean {
    if (!this.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    else if (this.isLoggedIn()) {
      return true;
    }
  }

  // verifyUserLogin(url): boolean {

  //   if (!this.isCustomerLoggedIn()) {
  //     this.router.navigate(['/customerpage']);
  //     return false;
  //   }
  //   else if (this.isCustomerLoggedIn()) {
  //     return true;
  //   }
  // }

  public isLoggedIn(): boolean {
    let status = false;
    if (localStorage.getItem('isLoggedIn') == "true") {
      status = true;
    }
    else {
      status = false;
    }
    return status;
  }

  // public isCustomerLoggedIn(): boolean {
  //   let status = false;
  //   if (localStorage.getItem('isCustomerLoggedIn') == "true") {
  //     status = true;
  //   }
  //   else {
  //     status = false;
  //   }
  //   return status;
  // }

}
