import { formatNumber, formatDate, formatCurrency } from '@angular/common';
import {
  Component,
  Inject,
  Input,
  LOCALE_ID,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationBatchTypes } from 'src/app/models/enums';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { ExportService } from 'src/app/services/Excel/export.service';
import { ReportsService } from 'src/app/services/Reports/reports.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { EventEmitterService } from '../../event-emitter.service';

@Component({
  selector: 'app-grower-quality-summary-detailed',
  templateUrl: './grower-quality-summary-detailed.component.html',
  styleUrls: ['./grower-quality-summary-detailed.component.scss'],
})
export class GrowerQualitySummaryDetailedComponent implements OnInit {
  growerInfo: any;
  ticketInfo: any;
  paymentInfo: any;
  cropyear: number =
    environment.cropyear != undefined ? environment.cropyear : 2022;
  cropYears = this.appSettingService.GetYears();
  accountnumber: any = '';
  calculationbatchid: any = 0;
  calculationbatches: any = [];
  reportHeaders: any = [];
  reportData: any = [];
  calculationBatchType: any;
  title: any = '';
  accountData: any = [];
  loadingService: any;
  isEnabled = false;
  @Input() childProperty: string;
  pdfpath: any;
  totalNet_count: number = 0;
  allTotal: number = 0;
  allNetWeight: number = 0;
  //accountNumber: any = '';
  reportData2: any;
  sortcolumn: string = 'Id';
  sortdirection: string = 'ASC';
  pagenumber: number = 1;
  pagesize: number = 10;
  searchstring: string = '';
  selected_count: number = 0;
  colorImagePath: string = '';
  classImagePath: string = '';

  colorImagePath2: string = '';
  classImagePath2: string = '';
  pdfPath: string = '';
  dualScanCropYear: number =
    environment.dualScanCropYear != undefined
      ? environment.dualScanCropYear
      : 2022;
  @ViewChild('modalImage') public modalImageComponent: ModalComponent;

  modalConfig: ModalConfig = {
    modalTitle: 'Image',
    size: 'sm',
    hideCloseButton() {
      return true;
    },
  };

  constructor(
    private reportService: ReportsService,
    public appSettingService: AppSettingsService,
    public excelService: ExcelService,
    private exportService: ExportService,
    @Inject(LOCALE_ID) public locale: string,
    private authHttpService: AuthHTTPService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private sanitizer: DomSanitizer
  ) {}

  public getSanitizeUrl(url: string): SafeUrl {
    debugger;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadDataFromMasterMenu(_accountnumber: any) {
    this.isEnabled = true;
    this.accountnumber = _accountnumber;
  }

  ngOnInit(): void {
    // if (localStorage.getItem('SelectedAccount') != undefined) {
    //   this.accountNumber = localStorage.getItem('SelectedAccount');
    // }
    debugger;
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar =
        this.eventEmitterService.invokeFirstComponentFunction.subscribe(
          (name: string) => {
            this.loadDataFromMasterMenu(name);
          }
        );
    } else {
      if (localStorage.getItem('SelectedAccount') != undefined) {
        this.accountnumber = localStorage.getItem('SelectedAccount');
      }
    }
  }
  GenerateReport() {
    this.getGrowerNonDeliveryReport(
      this.sortcolumn,
      this.sortdirection,
      this.searchstring,
      this.pagenumber,
      this.pagesize
    );
  }
  filterByCropYear(event: any) {}
  filterByAcc(acct: any) {
    var data = this.reportData.filter((x: any) => x.accountNo == acct);
    this.selected_count = data.length;
    // this.totalNet_count= data.filter((g)=>{
    //   this.totalNet_count = this.totalNet_count + g.netWeight;
    // });
    this.totalNet_count = 0;
    data.forEach((g: any) => {
      this.totalNet_count =
        parseInt(this.totalNet_count.toString()) +
        parseInt(g.netWeight == null ? '0' : g.netWeight.toString());
    });
    // this.allTotal = this.allTotal +   this.selected_count;
    // this.allNetWeight = this.allNetWeight +   this.totalNet_count;
    return data;
  }

  sort(sortby: string) {
    this.getGrowerNonDeliveryReport(
      sortby,
      this.sortdirection == 'DESC' ? 'ASC' : 'DESC',
      this.searchstring,
      this.pagenumber,
      this.pagesize
    );
  }

  ShowImage(imagepath: any, classpath: any, weighCertificate: any) {
    debugger;
    this.colorImagePath = environment.imagePathUrl + `${imagepath}`;
    this.classImagePath = environment.imagePathUrl + `${classpath}`;
    if (this.cropyear >= this.dualScanCropYear) {
      this.pdfPath =
        environment.imagePathUrl +
        classpath.replace('_class.png', '_colorreport.pdf');
      this.colorImagePath =
        environment.imagePathUrl +
        imagepath.replace('_color.png', '_color1.jpg');
      this.classImagePath =
        environment.imagePathUrl +
        classpath.replace('_class.png', '_class1.pdf');
      this.colorImagePath2 =
        environment.imagePathUrl +
        imagepath.replace('_color.png', '_color2.jpg');
      this.classImagePath2 =
        environment.imagePathUrl +
        classpath.replace('_class.png', '_class2.pdf');
    }
    this.modalConfig.modalTitle = 'Color Analyzer Report: ' + weighCertificate;
    this.modalConfig.size = 'lg';
    this.modalImageComponent.open();
  }
  imageErrordisplay() {
    console.log('Image not available..');
  }

  getGrowerNonDeliveryReport(
    sortcolumn: string,
    sortdirection: string,
    searchstring: string,
    pagenumber: number,
    pagesize: number
  ) {
    this.allTotal = 0;
    this.totalNet_count = 0;
    this.allNetWeight = 0;

    this.reportService
      .GetGrowerQualitySummaryDetailed({
        sortcolumn: sortcolumn,
        sortdirection: sortdirection,
        pagenumber: pagenumber,
        searchstring: searchstring,
        pagesize: pagesize,
        cropyear: this.cropyear,
        accountNo: this.accountnumber,
      })
      .subscribe({
        next: (data: any) => {
          debugger;
          this.reportData = data[0];

          this.reportData2 = data[1];
          this.reportData.forEach((g: any) => {
            this.allNetWeight =
              parseInt(this.allNetWeight.toString()) +
              parseInt(g.netWeight == null ? '0' : g.netWeight.toString());
          });
          this.allTotal = data[0].length;
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  GetdateFormated(data: any) {
    debugger;
    return data;
    if (data == null) {
      return '-';
    }

    if (typeof data === 'string') {
      return data;
    } else {
      return formatNumber(data, this.locale, '0.2-2');
    }
  }
  export() {
    let reportHeaders: any =
      this.cropyear < 2022
        ? [
            'Weigh Certificate',
            'Variety Name',
            'Receiving Date',
            'Grading',
            'Net Weight',
            '% Jumbo',
            '% Med Baby',
            '% Edible',
            'RLI',
            '% Insect',
            '% Blow',
            '% Ofg',
            'Ofg Dam',
            '% Ext Dam',
            'Ext Dam',
          ]
        : [
            'Weigh Certificate',
            'Variety Name',
            'Receiving Date',
            'Grading',
            'Net Weight',
            '% Jumbo',
            '% Med Baby',
            '% Edible',
            '% Light',
            '% Light Amber',
            '% Amber',
            '% Insect',
            '% Blow',
            '% Ofg',
            'Ofg Dam',
            '% Ext Dam',
            'Ext Dam',
          ];

    let columns: any[];
    let mainHeaderColumn: any = [];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Account No: ', this.accountnumber]);
    SearchColumns.push(['Crop Year: ', this.cropyear]);
    SearchColumns.push(['Grower Name: ' + this.reportData[0].name]);
    columns = reportHeaders;
    let new_list;
    debugger;
    if (this.cropyear < 2022) {
      new_list = this.reportData.map(function (obj: any) {
        return {
          name: obj.name,
          accountNo: obj.accountNo,
          ticketNumber: obj.ticketNumber,
          varietyName: obj.varietyName,
          receivingDate: obj.receivingDate,
          gradingTicketType: obj.gradingTicketType,
          netWeight: obj.netWeight,
          percentJumboSound: obj.percentJumboSound,
          medbaby: obj.medbaby,
          percentEdibleYield: obj.percentEdibleYield,
          rli: obj.rli,
          percentInsect: obj.percentInsect,
          percentBlowable: obj.percentBlowable,
          percentOffGrade: obj.percentOffGrade,
          predominantOffgradeDamage: obj.predominantOffgradeDamage,
          percentExternalDamage: obj.percentExternalDamage,
          predominantExternalDamage: obj.predominantExternalDamage,
        };
      });
    } else {
      new_list = this.reportData.map(function (obj: any) {
        return {
          name: obj.name,
          accountNo: obj.accountNo,
          ticketNumber: obj.ticketNumber,
          varietyName: obj.varietyName,
          receivingDate: obj.receivingDate,
          gradingTicketType: obj.gradingTicketType,
          netWeight: obj.netWeight,
          percentJumboSound: obj.percentJumboSound,
          medbaby: obj.medbaby,
          percentEdibleYield: obj.percentEdibleYield,
          percentExtraLightKernel: obj.percentExtraLightKernel,
          percentLightKernel: obj.percentLightKernel,
          percentLightAmberKernel: obj.percentLightAmberKernel,
          percentInsect: obj.percentInsect,
          percentBlowable: obj.percentBlowable,
          percentOffGrade: obj.percentOffGrade,
          predominantOffgradeDamage: obj.predominantOffgradeDamage,
          percentExternalDamage: obj.percentExternalDamage,
          predominantExternalDamage: obj.predominantExternalDamage,
        };
      });
    }

    var exportData: any = [];

    this.reportData.forEach((element: any) => {
      exportData.push(element);
    });

    this.excelService.exportAsExcelFileGrowerQuality(
      'Grading Data Report',
      '',
      columns,
      new_list,
      [],
      'GrowerQualitySummaryDetailed_Report_' +
        formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      'Grading Data Report',
      SearchColumns,
      mainHeaderColumn,
      this.reportData2,
      'Grading Data Report(2)',
      this.cropyear
    );
  }

  exportToPDF() {
    let reportHeadersPDF: any =
      this.cropyear < 2022
        ? [
            'Weigh Certificate',
            'Variety Name',
            'Receiving Date',
            'Grading',
            'Net Weight',
            '% Jumbo',
            '% Med Baby',
            '% Edible',
            'RLI',
            '% Insect',
            '% Blow',
            '% Ofg',
            'Ofg Dam',
            '% Ext Dam',
            'Ext Dam',
          ]
        : [
            'Weigh Certificate',
            'Variety Name',
            'Receiving Date',
            'Grading',
            'Net Weight',
            '% Jumbo',
            '% Med Baby',
            '% Edible',
            '% Light',
            '% Light Amber',
            '% Amber',
            '% Insect',
            '% Blow',
            '% Ofg',
            'Ofg Dam',
            '% Ext Dam',
            'Ext Dam',
          ];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Account Number: ' + this.accountnumber]);
    SearchColumns.push(['Crop Year: ' + this.cropyear]);
    SearchColumns.push(['Grower Name: ' + this.reportData[0].name]);
    debugger;
    var arr: any[][] = [];

    if (this.cropyear < 2022) {
      for (var i: number = 0; i < this.reportData.length; i++) {
        arr[i] = [];
        arr[i][0] = this.reportData[i].ticketNumber;
        arr[i][1] = this.reportData[i].varietyName;
        arr[i][2] = this.reportData[i].receivingDate;
        arr[i][3] = this.reportData[i].gradingTicketType;
        arr[i][4] = formatNumber(this.reportData[i].netWeight, this.locale);
        arr[i][5] = this.reportData[i].percentJumboSound + '%';
        arr[i][6] = this.reportData[i].medbaby + '%';
        arr[i][7] = this.reportData[i].percentEdibleYield + '%';
        arr[i][8] = this.reportData[i].rli;
        arr[i][9] = this.reportData[i].percentInsect + '%';
        arr[i][10] = this.reportData[i].percentBlowable + '%';
        arr[i][11] = this.reportData[i].percentOffGrade + '%';
        arr[i][12] = this.reportData[i].predominantOffgradeDamage;
        arr[i][13] = this.reportData[i].percentExternalDamage + '%';
        arr[i][14] = this.reportData[i].predominantExternalDamage;
      }
    } else {
      for (var i: number = 0; i < this.reportData.length; i++) {
        arr[i] = [];

        arr[i][0] = this.reportData[i].ticketNumber;
        arr[i][1] = this.reportData[i].varietyName;
        arr[i][2] = this.reportData[i].receivingDate;
        arr[i][3] = this.reportData[i].gradingTicketType;
        arr[i][4] = formatNumber(this.reportData[i].netWeight, this.locale);
        arr[i][5] = this.reportData[i].percentJumboSound + '%';
        arr[i][6] = this.reportData[i].medbaby + '%';
        arr[i][7] = this.reportData[i].percentEdibleYield + '%';
        arr[i][8] = this.reportData[i].percentExtraLightKernel + '%';
        arr[i][9] = this.reportData[i].percentLightKernel + '%';
        arr[i][10] = this.reportData[i].percentLightAmberKernel + '%';
        arr[i][11] = this.reportData[i].percentInsect + '%';
        arr[i][12] = this.reportData[i].percentBlowable + '%';
        arr[i][13] = this.reportData[i].percentOffGrade + '%';
        arr[i][14] = this.reportData[i].predominantOffgradeDamage;
        arr[i][15] = this.reportData[i].percentExternalDamage + '%';
        arr[i][16] = this.reportData[i].predominantExternalDamage;
      }
    }
    let head = reportHeadersPDF;

    var columnStyleRli: any = {
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
      10: { halign: 'right' },
      11: { halign: 'right' },
      12: { halign: 'right' },
      13: { halign: 'right' },
      14: { halign: 'right' },
      15: { halign: 'right' },
      17: { halign: 'right' },
    };

    var columnStyle: any = {
      4: { halign: 'right' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'right' },
      8: { halign: 'right' },
      9: { halign: 'right' },
      10: { halign: 'right' },
      11: { halign: 'right' },
      12: { halign: 'right' },
      13: { halign: 'right' },
      14: { halign: 'right' },
      15: { halign: 'right' },
      17: { halign: 'right' },
      18: { halign: 'right' },
      19: { halign: 'right' },
      20: { halign: 'right' },
    };

    this.exportService.expoertToPdf(
      arr,
      'Grading Data Report_' +
        formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      head,
      'Grading Data Report',
      'l',
      SearchColumns,
      ['', ''],
      [],
      'a2',
      this.cropyear < 2022 ? columnStyleRli : columnStyle
    );
  }
}
