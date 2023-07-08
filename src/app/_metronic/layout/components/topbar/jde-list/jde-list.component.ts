import { Component } from '@angular/core';
import { GrowerPortalService } from 'src/app/services/Grower/grower-portal.service';
@Component({
  selector: 'app-jde-list',
  templateUrl: './jde-list.component.html',
  styleUrls: ['./jde-list.component.scss']
})
export class JdeListComponent {

  constructor(
    private growerPortalService : GrowerPortalService
  ) { }

  ngOnInit(): void {
   this.GetUserAccountbyJDE();
  }
  jdeAccountList : any;

  GetUserAccountbyJDE() {
    debugger;
    var localNumber  = localStorage.getItem("JDENumber");
    this.growerPortalService.GetUserAccountbyJDE(localNumber).subscribe({
      next: (data: any) => {
        //debugger;
        this.jdeAccountList = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
