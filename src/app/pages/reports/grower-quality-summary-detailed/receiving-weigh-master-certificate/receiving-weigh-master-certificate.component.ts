import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ReceivingService } from 'src/app/services/Reports/receiving.service';

@Component({
  selector: 'app-receiving-weigh-master-certificate',
  templateUrl: './receiving-weigh-master-certificate.component.html',
  styleUrls: ['./receiving-weigh-master-certificate.component.scss']
})
export class ReceivingWeighMasterCertificateComponent implements OnInit {
  receivingTicketId: any;
  weighMasterCertificateDetails: any;
  location: any;
  copyHeader: any = 'SCALE COPY';
  printWindowSubscription: Subscription;
  constructor(
    private receivingService: ReceivingService,
    private _Activatedroute: ActivatedRoute
    // ,    private printerService: NgxPrinterService
  ) {
    this.receivingTicketId =
      this._Activatedroute.snapshot.paramMap.get('receivingTicketId');
    this.location = this._Activatedroute.snapshot.paramMap.get('location');
    // this.printWindowSubscription =
    //   this.printerService.$printWindowOpen.subscribe((val) => {
    //     console.log('Print window is open:', val);
    //   });
  }

  ngOnInit(): void {
    if (this.receivingTicketId != undefined)
      this.receivingService
        .Weighmastercertificate(this.receivingTicketId)
        .subscribe({
          next: (data: any) => {
            debugger;
            this.weighMasterCertificateDetails = data;
          },
          error: (err: any) => {
            console.log(err);
          },
        });
  }
  scaleCopy() {
    this.copyHeader = 'SCALE COPY';
  }
  dehydratorCopy() {
    this.copyHeader = 'DEHYDRATOR COPY';
  }
  inspectionCopy() {
    this.copyHeader = 'GROWER INSPECTION COPY';
  }
  printCertificate(classname: string) {
    //this.printerService.printByClassName(classname);
  }

  printAllCertificate() {
    //this.printerService.printDiv('maintableofpdf');
  }
}
