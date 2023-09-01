import { formatDate, formatNumber } from '@angular/common';
import { Component, LOCALE_ID } from '@angular/core';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { ExportService } from 'src/app/services/Excel/export.service';
import { ReportsService } from 'src/app/services/Reports/reports.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { EventEmitterService } from '../../event-emitter.service';

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
  reportHeaders: any = [];
  reportData: any = [];

  constructor(private reportService: ReportsService,
    public appSettingService: AppSettingsService,
    public excelService: ExcelService, private exportService: ExportService,
    private eventEmitterService: EventEmitterService,
  ) {


  }
  ngOnInit(): void {
    if (localStorage.getItem('SelectedAccount') != undefined) {
      this.accountnumber = localStorage.getItem('SelectedAccount');
    }
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.loadDataFromMasterMenu(name);
        });
    }
  }
  loadDataFromMasterMenu(_accountnumber: any) {
    this.accountnumber = _accountnumber;
  }
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
        this.reportData = data.receivingTicketsDetailsForPrint;
        const map = new Map();
        data.receivingTicketsDetails.map((s: any) => map.set(s.varietyId, s.varietyId));
        this.varieties = Array.from(map.values());
        this.finalTotal = this.varietyTotal = data.receivingTicketsDetails.reduce((sum: any, current: { netWeight: any; }) => sum + current.netWeight, 0);
      },
      error: (err: any) => {
        Swal.fire({
          html: 'Data not found for account number : ' + this.accountnumber,
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
        this.reportData = null;
        this.receivingTickets = null;
        this.varieties = null;
        this.finalTotal = '';
      },
    });
  }

  filterByVariety(varierId: any) {
    if (this.receivingTickets != null) {
      var data = this.receivingTickets.filter((x: any) => x.varietyId == varierId);
      this.varietyName = data[0].variety;
      this.varietyTotal = data.reduce((sum: any, current: { netWeight: any; }) => sum + current.netWeight, 0);
      return data;
    }
    return null;
  }

  exportToPDF() {
    debugger;
    let head = this.reportHeaders;
    head = ['Account Number', 'Account Description', 'Weigh Certificate	', 'PD9 #', 'Receiving Date', 'Variety', 'Gross Weight', 'Tare Weight', 'Net Weight'];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Grower Name - ' + this.growerName]);
    SearchColumns.push(['Account Number - ' + this.accountnumber]);
    SearchColumns.push(['Crop Year - ' + this.cropyear]);
    var arr: any[][] = [];
    for (var i: number = 0; i < this.reportData.length; i++) {
      debugger;
      arr[i] = [];
      arr[i][0] = this.reportData[i].accountNumber == 'Total For Variety:' || this.reportData[i].accountNumber == 'Total For Account:' ? this.reportData[i].accountNumber : this.reportData[i].accountNumber + ' Paid';
      arr[i][1] = this.reportData[i].accountDescription;
      arr[i][2] = this.reportData[i].weightCertificate;
      arr[i][3] = this.reportData[i].shippingManifest;
      arr[i][4] = this.reportData[i].receivingDate;
      arr[i][5] = this.reportData[i].variety;
      arr[i][6] = this.reportData[i].grossWeight == 0 ? '' : this.reportData[i].grossWeight;
      arr[i][7] = this.reportData[i].tareWeight == 0 ? '' : this.reportData[i].tareWeight;
      arr[i][8] = this.reportData[i].netWeight == 0 ? '' : this.reportData[i].netWeight;
    }
    var columnStyle: any = {
      1: { halign: 'center' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
    };
    this.exportService.expoertToPdf(
      arr,
      'Receiving_Tickets_' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      head,
      'Receiving Tickets',
      'l',
      SearchColumns,
      ['', ''],
      [], 'a4', columnStyle
    );
  }

  exportToExcel() {
    debugger;
    let head = this.reportHeaders;
    head = ['Account Number', 'Account Description', 'Weigh Certificate	', 'PD9 #', 'Receiving Date', 'Variety', 'Gross Weight', 'Tare Weight', 'Net Weight'];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Grower Name - ' + this.growerName]);
    SearchColumns.push(['Account Number - ' + this.accountnumber]);
    SearchColumns.push(['Crop Year - ' + this.cropyear]);
    var arr: any[][] = [];
    for (var i: number = 0; i < this.reportData.length; i++) {
      debugger;
      arr[i] = [];
      arr[i][0] = this.reportData[i].accountNumber == 'Total For Variety:' || this.reportData[i].accountNumber == 'Total For Account:' ? this.reportData[i].accountNumber : this.reportData[i].accountNumber + ' Paid';
      arr[i][1] = this.reportData[i].accountDescription;
      arr[i][2] = this.reportData[i].weightCertificate;
      arr[i][3] = this.reportData[i].shippingManifest;
      arr[i][4] = this.reportData[i].receivingDate;
      arr[i][5] = this.reportData[i].variety;
      arr[i][6] = this.reportData[i].grossWeight == 0 ? '' : this.reportData[i].grossWeight;
      arr[i][7] = this.reportData[i].tareWeight == 0 ? '' : this.reportData[i].tareWeight;
      arr[i][8] = this.reportData[i].netWeight == 0 ? '' : this.reportData[i].netWeight;
    }

    this.excelService.exportAsExcelFile('Receiving Tickets', '',
      head, arr, [],
      'Receiving_Tickets_' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      'Receiving Tickets', SearchColumns, [], [], '', [], [], [], []
    );
  }
}

