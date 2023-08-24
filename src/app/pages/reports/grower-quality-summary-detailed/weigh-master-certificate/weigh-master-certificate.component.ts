import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { GradingticketService } from 'src/app/services/Reports/gradingticket.service';
import { ModalComponent } from 'src/app/_metronic/partials';

@Component({
  selector: 'app-weigh-master-certificate',
  templateUrl: './weigh-master-certificate.component.html',
  styleUrls: ['./weigh-master-certificate.component.scss']
})
export class WeighMasterCertificateComponent implements OnInit {
  gradingticketId: any;
  weighMasterCertificateDetails: any;
  printWindowSubscription: Subscription;
  analysisHeader: any;
  analysisChild1: any;
  analysisChild2: any;
  analysisChild3: any;
  cropyear: any;
  constructor(
    private gradingticketService: GradingticketService,
    private _Activatedroute: ActivatedRoute
    //,    private printerService: NgxPrinterService
  ) {
    this.gradingticketId = this._Activatedroute.snapshot.paramMap.get('id');
    // this.printWindowSubscription =
    //   this.printerService.$printWindowOpen.subscribe((val) => {
    //     console.log('Print window is open:', val);
    //   });
  }
  @ViewChild('modal') private modalComponent: ModalComponent;
  @ViewChild('dataBlock') block: ElementRef;
  closeModal() {
    this.modalComponent.close();
  }
  ngOnInit(): void {
    debugger;
    this.gradingticketService
      .Weighmastercertificate(this.gradingticketId)
      .subscribe({
        next: (data: any) => {
          this.weighMasterCertificateDetails = data;
          this.cropyear = data.cropYear;
          this.analysisHeader = data.cropYear < 2022 ? "RLI" : "Color Analyzer";
          this.analysisChild1 = data.cropYear < 2022 ? "RLI1" : "% Light & Extra Light";
          this.analysisChild2 = data.cropYear < 2022 ? "RLI2" : "% Light Amber";
          this.analysisChild3 = data.cropYear < 2022 ? "" : "% Amber & Dark";


        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  printCertificate() {
    //this.printerService.printDiv('maintableofpdf');
  }
}
