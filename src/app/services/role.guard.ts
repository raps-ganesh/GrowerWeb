import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor() {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const expectedRole = route.data.expectedRole;
    const usedata = localStorage.getItem('loggedinUserRoles');
    if (localStorage.getItem('loggedinUserRoles') == undefined) {
      window.location.href = '/';
    }
    if (localStorage.getItem('loggedinUserRoles')) {
      var list = JSON.parse(usedata || '{}');
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        const user = expectedRole.find((u: any) => {
          return u === element;
        });
        if (user) {
          return true;
        }
      }
    }
    Swal.fire(
      'Access Denied',
      'You don’t have permission to access this action!!!',
      'error'
    );
    return false;
  }

  canShow(expectedRole: any) {
    const usedata = localStorage.getItem('loggedinUserRoles');
    if (usedata == undefined) {
      window.location.href = '/';
    }
    if (localStorage.getItem('loggedinUserRoles')) {
      var list = JSON.parse(usedata || '{}');
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        const user = expectedRole.find((u: any) => {
          return u === element;
        });
        if (user) {
          return true;
        }
      }
    }
    return false;
  }
}
