import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentCalculationReportComponent } from './payment-calculation-report/payment-calculation-report.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GrowerQualitySummaryDetailedComponent } from './grower-quality-summary-detailed/grower-quality-summary-detailed.component';
import { ModalsModule } from "../../_metronic/partials/layout/modals/modals.module";
import { ReceivingWeighMasterCertificateComponent } from './grower-quality-summary-detailed/receiving-weigh-master-certificate/receiving-weigh-master-certificate.component';
import { WeighMasterCertificateComponent } from './grower-quality-summary-detailed/weigh-master-certificate/weigh-master-certificate.component';
import { RouterModule } from '@angular/router';
import { ReceivingTicketsReportComponent } from './receiving-tickets-report/receiving-tickets-report.component';
import { DehydratorDeliveriesByManifestReportComponent } from './dehydrator-deliveries-by-manifest-report/dehydrator-deliveries-by-manifest-report.component';
import { DehydratorDeliveryByGrowerAccountComponent } from './dehydrator-delivery-by-grower-account/dehydrator-delivery-by-grower-account.component';


@NgModule({
  declarations: [
    PaymentCalculationReportComponent,
    GrowerQualitySummaryDetailedComponent,
    ReceivingWeighMasterCertificateComponent,
    WeighMasterCertificateComponent,
    ReceivingTicketsReportComponent,
    DehydratorDeliveriesByManifestReportComponent,
    DehydratorDeliveryByGrowerAccountComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    PdfViewerModule,
    ModalsModule,
    RouterModule.forChild([
      {
        path: '',
        component: GrowerQualitySummaryDetailedComponent,
      },
    ]),
  ]
})
export class ReportsModule { }
