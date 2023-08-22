import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentCalculationReportComponent } from './payment-calculation-report/payment-calculation-report.component';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { GrowerQualitySummaryDetailedComponent } from './grower-quality-summary-detailed/grower-quality-summary-detailed.component';
import { ModalsModule } from "../../_metronic/partials/layout/modals/modals.module";


@NgModule({
    declarations: [
        PaymentCalculationReportComponent,
        GrowerQualitySummaryDetailedComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        PdfViewerModule,
        ModalsModule
    ]
})
export class ReportsModule { }
