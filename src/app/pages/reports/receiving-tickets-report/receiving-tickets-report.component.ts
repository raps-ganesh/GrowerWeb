import { Component } from '@angular/core';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { ReportsService } from 'src/app/services/Reports/reports.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-receiving-tickets-report',
  templateUrl: './receiving-tickets-report.component.html',
  styleUrls: ['./receiving-tickets-report.component.scss']
})
export class ReceivingTicketsReportComponent {
  cropyear: number =
    environment.cropyear != undefined ? environment.cropyear : 2022;
  cropYears = this.appSettingService.GetYears();
  accountnumber: any;
  receivingTickets: any;
  growerName: any;
  varieties: any;
  varietyName: any
  varietyTotal: any;
  finalTotal: any;

  constructor(private reportService: ReportsService,
    public appSettingService: AppSettingsService,
    public excelService: ExcelService,) { }

  GenerateReport() {
    if (this.accountnumber == '') {
      Swal.fire({
        html: 'Please enter valid account number',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }
    debugger;
    this.reportService.GetReceivingTickets({ accountnumber: this.accountnumber, cropyear: this.cropyear }).subscribe({
      next: (data: any) => {
        debugger;
        this.growerName = data.growerName;
        this.receivingTickets = data.receivingTicketsDetails;
        const map = new Map();
        data.receivingTicketsDetails.map((s: any) => map.set(s.varietyId, s.varietyId));
        this.varieties = Array.from(map.values());
        this.finalTotal = this.varietyTotal = data.receivingTicketsDetails.reduce((sum: any, current: { netWeight: any; }) => sum + current.netWeight, 0);
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  filterByVariety(varierId: any) {
    var data = this.receivingTickets.filter((x: any) => x.varietyId == varierId);
    this.varietyName = data[0].variety;
    this.varietyTotal = data.reduce((sum: any, current: { netWeight: any; }) => sum + current.netWeight, 0);
    return data;

  }
}
