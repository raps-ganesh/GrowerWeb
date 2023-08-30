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
  selector: 'app-dehydrator-deliveries-by-manifest-report',
  templateUrl: './dehydrator-deliveries-by-manifest-report.component.html',
  styleUrls: ['./dehydrator-deliveries-by-manifest-report.component.scss']
})
export class DehydratorDeliveriesByManifestReportComponent {
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
  dehydratortypeaheadUrl: any = environment.reportsBaseUrl + 'DehydratorTypeAhead/false/null';
  constructor(private reportService: ReportsService,
    public appSettingService: AppSettingsService,
    public excelService: ExcelService, private exportService: ExportService
    , private adminService: AdminService) {
    // this.adminService.GetDehydratorsForUser({ userid: localStorage.getItem('UserId') }).subscribe({
    //   next: (data: any) => {
    //     debugger;
    //     var user = data;
    //     this.dehydratortypeaheadUrl = environment.reportsBaseUrl + 'DehydratorTypeAhead/true/' + data.account;
    //   },
    //   error: (err: any) => {
    //     console.log(err);
    //   },
    // });
  }
  ngOnInit(): void {
    debugger;
    this.adminService.GetDehydratorsForUser({ userid: localStorage.getItem('UserId') }).subscribe({
      next: (data: any) => {
        var isadmin = data == undefined;
        this.dehydratortypeaheadUrl = environment.reportsBaseUrl + 'DehydratorTypeAhead/' + isadmin + '/' + data.account;
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
    debugger;
    this.reportService.GetDehydratorDeliveries({ dehyderatorId: this.dehyderatoraccount, cropyear: this.cropyear, isManifest: true }).subscribe({
      next: (data: any) => {
        debugger;
        this.dehydrator = data.dehydratorDetails.dehydrator;
        this.dehyderatorId = data.dehydratorDetails.dehydratorAccountNo
        this.dehydratorData = data.dehydratorDeliveries;
        this.reportData = data.dehydratorDeliveriesForPrint;
        const map = new Map();
        data.dehydratorDeliveries.map((s: any) => map.set(s.varietyId, s.varietyId));
        this.varieties = Array.from(map.values());
        this.finalTotal = data.dehydratorDeliveries.reduce((sum: any, current: { netWeight: any; }) => sum + current.netWeight, 0);
        var sumtrailer1Moisture = data.dehydratorDeliveries.reduce((sum: any, current: { trailer1Moisture: any; }) => sum + current.trailer1Moisture, 0);
        this.trailer1Moisture = this.round((sumtrailer1Moisture / data.dehydratorDeliveries.filter((x: any) => x.trailer1Moisture != '' && x.trailer1Moisture > 0).length || 0), 1);
        var sumtrailer2Moisture = data.dehydratorDeliveries.reduce((sum: any, current: { trailer2Moisture: any; }) => sum + current.trailer2Moisture, 0);
        var test = (sumtrailer2Moisture / data.dehydratorDeliveries.filter((x: any) => x.trailer2Moisture != '' && x.trailer2Moisture > 0).length || 0).toString();
        this.trailer2Moisture = this.round((sumtrailer2Moisture / data.dehydratorDeliveries.filter((x: any) => x.trailer2Moisture != '' && x.trailer2Moisture > 0).length || 0), 1);
      },
      error: (err: any) => {
        console.log(err);
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
    head = ['PD9 #', 'Weight\r\n Certificate', 'Receiving\r\n Date', 'Grower Account', 'Grower Name', 'Account\r\n Description', 'Variety', 'Gross\r\n Weight', 'Tare \r\nWeight', 'Net\r\n Weight', 'Trailer 1\r\n Moisture', 'Trailer 2 \r\nMoisture'];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Dehydrator - ' + this.dehyderatorId + '              ' + this.dehydrator]);
    SearchColumns.push(['Crop Year - ' + this.cropyear]);
    var arr: any[][] = [];
    for (var i: number = 0; i < this.reportData.length; i++) {
      arr[i] = [];
      arr[i][0] = this.reportData[i].shippingManifest;
      arr[i][1] = this.reportData[i].weightCertificate;
      arr[i][2] = this.reportData[i].receivingDate;
      arr[i][3] = this.reportData[i].growerAccountNumber;
      arr[i][4] = this.reportData[i].growerName;
      arr[i][5] = this.reportData[i].accountDescription;
      arr[i][6] = this.reportData[i].variety;
      arr[i][7] = this.reportData[i].grossWeight == 0 ? '' : this.reportData[i].grossWeight;
      arr[i][8] = this.reportData[i].tareWeight == 0 ? '' : this.reportData[i].tareWeight;
      arr[i][9] = this.reportData[i].netWeight == 0 ? '' : this.reportData[i].netWeight;
      arr[i][10] = this.reportData[i].trailer1Moisture == 0 ? '' : this.round(this.reportData[i].trailer1Moisture, 1);
      arr[i][11] = this.reportData[i].trailer2Moisture == 0 ? '' : this.round(this.reportData[i].trailer2Moisture, 1);
    }
    var columnStyle: any = {
      0: { halign: 'center' },
      1: { halign: 'center' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
      10: { halign: 'right' },
      11: { halign: 'right' },
    };
    this.exportService.expoertToPdf(
      arr,
      'Dehydrator_Deliveries_by_Manifest_' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      head,
      'Dehydrator Deliveries by Manifest',
      'l',
      SearchColumns,
      ['', ''],
      [], 'a3', columnStyle
    );
  }

  exportToExcel() {
    debugger;
    let head = this.reportHeaders;
    head = ['PD9 #', 'Weight Certificate', 'Receiving Date', 'Grower Account', 'Grower Name', 'Account Description', 'Variety', 'Gross Weight', 'Tare Weight', 'Net Weight', 'Trailer 1 Moisture', 'Trailer 2 Moisture'];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Dehydrator - ' + this.dehyderatorId + '              ' + this.dehydrator]);
    SearchColumns.push(['Crop Year - ' + this.cropyear]);
    var arr: any[][] = [];
    for (var i: number = 0; i < this.reportData.length; i++) {
      arr[i] = [];
      arr[i][0] = this.reportData[i].shippingManifest == 'Varierty Total:' || this.reportData[i].accountNumber == 'Total For Dehydrator:' ? this.reportData[i].accountNumber : this.reportData[i].shippingManifest;
      arr[i][1] = this.reportData[i].weightCertificate;
      arr[i][2] = this.reportData[i].receivingDate;
      arr[i][3] = this.reportData[i].growerAccountNumber;
      arr[i][4] = this.reportData[i].growerName;
      arr[i][5] = this.reportData[i].accountDescription;
      arr[i][6] = this.reportData[i].variety;
      arr[i][7] = this.reportData[i].grossWeight == 0 ? '' : this.reportData[i].grossWeight;
      arr[i][8] = this.reportData[i].tareWeight == 0 ? '' : this.reportData[i].tareWeight;
      arr[i][9] = this.reportData[i].netWeight == 0 ? '' : this.reportData[i].netWeight;
      arr[i][10] = this.reportData[i].trailer1Moisture == 0 ? '' : this.round(this.reportData[i].trailer1Moisture, 1);
      arr[i][11] = this.reportData[i].trailer2Moisture == 0 ? '' : this.round(this.reportData[i].trailer2Moisture, 1);
    }

    this.excelService.exportAsExcelFile('Receiving Tickets', '',
      head, arr, [],
      'Dehydrator_Deliveries_by_Manifest_' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      'Dehydrator Deliveries by Manifest', SearchColumns, [], [], '', [], [], [], []
    );
  }
  populateDehyderatorInfo(event: any) {
    this.dehyderatoraccount = event;
  }
}
