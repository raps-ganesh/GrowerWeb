import { Component, OnInit } from '@angular/core';
import { RoleGuard } from 'src/app/services/role.guard';

@Component({
  selector: 'app-engages',
  templateUrl: './engages.component.html',
  styleUrls: ['./engages.component.scss']
})
export class EngagesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
