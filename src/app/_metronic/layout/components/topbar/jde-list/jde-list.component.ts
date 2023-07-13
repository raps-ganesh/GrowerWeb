import { Component, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/pages/event-emitter.service';
import { PaymentCalculationReportComponent } from 'src/app/pages/reports/payment-calculation-report/payment-calculation-report.component';
import { GrowerPortalService } from 'src/app/services/Grower/grower-portal.service';
@Component({
  selector: 'app-jde-list',
  templateUrl: './jde-list.component.html',
  styleUrls: ['./jde-list.component.scss']
})
export class JdeListComponent {

  // @ViewChild(PaymentCalculationReportComponent)
  // private paymentCalculationReportComponent: PaymentCalculationReportComponent;

  @ViewChild(PaymentCalculationReportComponent , {static : true}) paymentCalculationReportComponent!:PaymentCalculationReportComponent ;
  
  jdeAccountNumber:any;
  constructor(
    private growerPortalService : GrowerPortalService,
    private eventEmitterService: EventEmitterService
  ) { }

  ngOnInit(): void {
   this.GetUserAccountbyJDE();
  }
  jdeAccountList : any;
  LoadData(accNo:any)
  {
    this.jdeAccountNumber=accNo;
    setTimeout(() => {
      this.eventEmitterService.onFirstComponentButtonClick(accNo);
    }, 200);
  }
  GetUserAccountbyJDE() {
    debugger;
    var localNumber  = localStorage.getItem("JDENumber");
    this.growerPortalService.GetUserAccountbyJDE(localNumber).subscribe({
      next: (data: any) => {
        debugger;
        this.jdeAccountList = data;
        if(data.length>0)
        {
          this.jdeAccountNumber=data[0];
          this.LoadData(this.jdeAccountNumber);
        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }
}
