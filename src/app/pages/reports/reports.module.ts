import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentCalculationReportComponent } from './payment-calculation-report/payment-calculation-report.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';


@NgModule({
  declarations: [
    PaymentCalculationReportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BrowserModule,
    PdfViewerModule
  ]
})
export class ReportsModule { }
