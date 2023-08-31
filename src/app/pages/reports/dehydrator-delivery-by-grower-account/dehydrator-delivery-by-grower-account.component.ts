import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AdminService } from 'src/app/services/Admin/admin.service';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { ExportService } from 'src/app/services/Excel/export.service';
import { ReportsService } from 'src/app/services/Reports/reports.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dehydrator-delivery-by-grower-account',
  templateUrl: './dehydrator-delivery-by-grower-account.component.html',
  styleUrls: ['./dehydrator-delivery-by-grower-account.component.scss']
})
export class DehydratorDeliveryByGrowerAccountComponent {
  cropyear: number =
    environment.cropyear != undefined ? environment.cropyear : 2022;
  cropYears = this.appSettingService.GetYears();
  @Input() dehyderatorId: string;
  @Input() dehyderatoraccount: string;
  dehydrator: any;
  finalTotal: any;
  trailer1Moisture: any;
  trailer2Moisture: any;
  dehydratorData: any;
  reportHeaders: any = [];
  reportData: any = [];
  varieties: any;
  varietyName: any;
  varietyTotal: any;
  accountTotal: any;
  accounts: any;
  dehydratortypeaheadUrl: any;
  constructor(private reportService: ReportsService,
    public appSettingService: AppSettingsService,
    public excelService: ExcelService, private exportService: ExportService, private adminService: AdminService
    ,) {

  }

  ngOnInit(): void {
    this.adminService.GetDehydratorsForUser({ userid: localStorage.getItem('UserId') }).subscribe({
      next: (data: any) => {
        var isadmin = data == undefined;
        this.dehydratortypeaheadUrl = environment.reportsBaseUrl + 'DehydratorTypeAhead/' + isadmin + '/' + (data.account == '' ? 0 : data.account);
      },
      error: (err: any) => {
        console.log(err);
      },
    });

  }
  GenerateReport() {
    if (this.dehyderatoraccount == '') {
      Swal.fire({
        html: 'Please enter valid Grower',
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      return;
    }
    this.reportService.GetDehydratorDeliveries({ dehyderatorId: this.dehyderatoraccount, cropyear: this.cropyear, isManifest: false }).subscribe({
      next: (data: any) => {
        this.dehydrator = data.dehydratorDetails.dehydrator;
        this.dehyderatorId = data.dehydratorDetails.dehydratorAccountNo
        this.dehydratorData = data.dehydratorDeliveries;
        this.reportData = data.dehydratorDeliveriesForPrint;
      },
      error: (err: any) => {
        Swal.fire({
          html: 'No Data Found',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      },
    });
  }
  round(value: number, precision: any) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
  exportToPDF() {
    debugger;
    let head = this.reportHeaders;
    head = ['PD9 #', 'Weight\r\n Certificate', 'Receiving\r\n Date', 'Gross\r\n Weight', 'Tare \r\nWeight', 'Net\r\n Weight', 'Trailer 1\r\n Moisture', 'Trailer 2 \r\nMoisture'];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Dehydrator - ' + this.dehyderatorId + '              ' + this.dehydrator]);
    SearchColumns.push(['Crop Year - ' + this.cropyear]);
    var arr: any[][] = [];
    for (var i: number = 0; i < this.reportData.length; i++) {
      arr[i] = [];
      arr[i][0] = this.reportData[i].shippingManifest;
      arr[i][1] = this.reportData[i].weightCertificate;
      arr[i][2] = this.reportData[i].receivingDate;
      arr[i][3] = this.reportData[i].grossWeight == 0 ? '' : this.reportData[i].grossWeight;
      arr[i][4] = this.reportData[i].tareWeight == 0 ? '' : this.reportData[i].tareWeight;
      arr[i][5] = this.reportData[i].netWeight == 0 ? '' : this.reportData[i].netWeight;
      arr[i][6] = this.reportData[i].trailer1Moisture == 0 ? '' : this.round(this.reportData[i].trailer1Moisture, 1);
      arr[i][7] = this.reportData[i].trailer2Moisture == 0 ? '' : this.round(this.reportData[i].trailer2Moisture, 1);
    }
    var columnStyle: any = {
      0: { halign: 'center' },
      1: { halign: 'center' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
    };
    this.exportService.expoertToPdf(
      arr,
      'Dehydrator_Deliveries_by_Grower_Account' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      head,
      'Dehydrator Deliveries by Grower Account',
      'l',
      SearchColumns,
      ['', ''],
      [], 'a4', columnStyle
    );
  }

  exportToExcel() {
    debugger;
    let head = this.reportHeaders;
    head = ['PD9 #', 'Weight\r\n Certificate', 'Receiving\r\n Date', 'Gross\r\n Weight', 'Tare \r\nWeight', 'Net\r\n Weight', 'Trailer 1\r\n Moisture', 'Trailer 2 \r\nMoisture'];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Dehydrator - ' + this.dehyderatorId + '              ' + this.dehydrator]);
    SearchColumns.push(['Crop Year - ' + this.cropyear]);
    var arr: any[][] = [];
    for (var i: number = 0; i < this.reportData.length; i++) {
      arr[i] = [];
      arr[i][0] = this.reportData[i].shippingManifest;
      arr[i][1] = this.reportData[i].weightCertificate;
      arr[i][2] = this.reportData[i].receivingDate;
      arr[i][3] = this.reportData[i].grossWeight == 0 ? '' : this.reportData[i].grossWeight;
      arr[i][4] = this.reportData[i].tareWeight == 0 ? '' : this.reportData[i].tareWeight;
      arr[i][5] = this.reportData[i].netWeight == 0 ? '' : this.reportData[i].netWeight;
      arr[i][6] = this.reportData[i].trailer1Moisture == 0 ? '' : this.round(this.reportData[i].trailer1Moisture, 1);
      arr[i][7] = this.reportData[i].trailer2Moisture == 0 ? '' : this.round(this.reportData[i].trailer2Moisture, 1);
    }

    this.excelService.exportAsExcelFile('Receiving Tickets', '',
      head, arr, [],
      'Dehydrator_Deliveries_by_Grower_Account' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      'Dehydrator Deliveries by Grower Account', SearchColumns, [], [], '', [], [], [], []
    );
  }
  populateDehyderatorInfo(event: any) {
    this.dehyderatoraccount = event;
  }
}
