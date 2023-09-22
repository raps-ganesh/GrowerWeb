import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/pages/event-emitter.service';
import { AdminService } from 'src/app/services/Admin/admin.service';
import { RoleGuard } from 'src/app/services/role.guard';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss'],
})
export class HeaderMenuComponent implements OnInit {
  IsAccountHasSpotPayment: any;
  constructor(private router: Router, private adminService: AdminService, private eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    debugger;
    var isAdmin: any = false;
    if (localStorage.getItem('loggedinUserRoles') == undefined) {
      isAdmin = false;
    }
    else {
      var list = JSON.parse(localStorage.getItem('loggedinUserRoles') || '{}');
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        const user = ["Administrators"].find((u: any) => {
          return u === element;
        });
        if (user) {
          isAdmin = true;
          break;
        }
      }
    }
    if (!isAdmin) {
      if (this.eventEmitterService.subsVar1 == undefined) {
        this.eventEmitterService.subsVar1 = this.eventEmitterService.
          invokeSecondComponentFunction.subscribe((name: string) => {
            this.adminService.IsAccountHasSpotPayment({ accountNumber: localStorage.getItem('SelectedAccount'), cropYear: environment.cropyear }).subscribe({
              next: (data: any) => {
                this.IsAccountHasSpotPayment = data;
              },
              error: (err: any) => {
                console.log(err);
              },
            });
          });
      }
    }
    else {
      this.IsAccountHasSpotPayment = true;
    }
  }

  calculateMenuItemCssClass(url: string): string {
    return checkIsActive(this.router.url, url) ? 'active' : '';
  }

  ShowAdminOnly() {
    return (
      new RoleGuard().canShow([
        'Administrators',
        'Internal Users',
        // 'Growers',
        // 'Dehydrators'
      ])
    );
  }

  ShowAll() {
    return (
      new RoleGuard().canShow([
        'Administrators',
        'Internal Users',
        'Growers',
        'Dehydrators'
      ])
    );
  }



}

const getCurrentUrl = (pathname: string): string => {
  return pathname.split(/[?#]/)[0];
};

const checkIsActive = (pathname: string, url: string) => {
  const current = getCurrentUrl(pathname);
  if (!current || !url) {
    return false;
  }

  if (current === url) {
    return true;
  }

  if (current.indexOf(url) > -1) {
    return true;
  }

  return false;
};
