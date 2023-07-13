import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  gradingTickets: any = [];
  gradingTicketsToDownload: any = [];
  pagenumber: number = 1;
  pagesize: number = 10;
  status: string = 'All';
  searchstring: string = '';
  pagecount: number = 0;
  cropyear: number =
    environment.cropyear != undefined ? environment.cropyear : 2022;

  sortcolumn: string = 'ticketnumber';
  sortdirection: string = 'DESC';






}
