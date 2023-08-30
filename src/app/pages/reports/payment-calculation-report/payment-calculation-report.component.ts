import { formatNumber, formatDate, formatCurrency } from '@angular/common';
import { Component, ElementRef, Inject, Input, LOCALE_ID, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CalculationBatchTypes } from 'src/app/models/enums';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { ReportsService } from 'src/app/services/Reports/reports.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { EventEmitterService } from '../../event-emitter.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { GrowerPortalService } from 'src/app/services/Grower/grower-portal.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-payment-calculation-report',
  templateUrl: './payment-calculation-report.component.html',
  styleUrls: ['./payment-calculation-report.component.scss']
})
export class PaymentCalculationReportComponent implements OnInit {
  growerInfo: any;
  ticketInfo: any;
  paymentInfo: any;
  cropyear: number =
    environment.cropyear != undefined ? environment.cropyear : 2022;
  cropYears = this.appSettingService.GetYears();
  @Input() accountnumber: any = '';
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
  jdeAddressBookNumber: any;
  hideCalculationBatches: any = false;
  deferralDate: any;
  showDeferralDate: any = false;
  constructor(

    private reportService: ReportsService,
    public appSettingService: AppSettingsService,
    public excelService: ExcelService,
    @Inject(LOCALE_ID) public locale: string,
    private authHttpService: AuthHTTPService,
    private router: Router,
    private eventEmitterService: EventEmitterService,
    private sanitizer: DomSanitizer,
    private growerPortalService: GrowerPortalService,
    private http: HttpClient
  ) {
    var calcBatchType =
      this.router.url.split('/')[2] != null
        ? this.router.url.split('/')[2]
        : 'Delivery';
    //
    debugger;
    this.hideCalculationBatches = false;
    this.showDeferralDate = false;
    switch (calcBatchType.toLowerCase()) {

      case 'Delivery'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.Delivery;
        this.title = 'Delivery';
        break;
      case 'Spot'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.SpotEMF;
        this.title = 'Spot';
        break;
      case 'February'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.FebProgress;
        this.title = 'February';
        break;
      case 'May'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.MayProgress;
        this.title = 'May';
        break;
      case 'Final'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.FinalPayment;
        this.title = 'Final';
        break;
      case 'TrueUp'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.TrueUp;
        this.title = 'TrueUp';
        break;
      case 'Deferred'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.Deferral;
        this.hideCalculationBatches = true;
        this.showDeferralDate = true;
        this.title = 'Deferred';
        break;
      case 'Yearend'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.YearEnd;
        this.hideCalculationBatches = true;
        this.title = 'YearEnd';
        break;
    }
    alert(this.showDeferralDate);
  }

  public getSanitizeUrl(url: string): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadDataFromMasterMenu(_accountnumber: any) {
    this.isEnabled = true;
    this.accountnumber = _accountnumber;
    this.GetBatches();
  }

  ngOnInit(): void {
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.loadDataFromMasterMenu(name);
        });
    }

    this.showDeferralDate = true;
    switch (this.calculationBatchType) {
      case CalculationBatchTypes.Deferral:
        this.showDeferralDate = true;
        break;
      default:
        this.showDeferralDate = false;
        break;
    }

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
    if (this.calculationBatchType != CalculationBatchTypes.Deferral) {

      if (this.deferralDate == '') {
        Swal.fire({
          html: 'Please enter valid Deferral Date',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
        return;
      }
    }
    if (this.calculationBatchType != CalculationBatchTypes.Deferral && this.calculationBatchType != CalculationBatchTypes.YearEnd) {
      if (this.calculationbatchid == '') {
        Swal.fire({
          html: 'Please enter valid calculation batch',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
        return;
      }
    }

    switch (this.calculationBatchType) {
      case CalculationBatchTypes.Delivery:
      case CalculationBatchTypes.FebProgress:
      case CalculationBatchTypes.MayProgress:
      case CalculationBatchTypes.FinalPayment:
      case CalculationBatchTypes.TrueUp:
      case CalculationBatchTypes.SpotEMF:
        this.growerPortalService.GetJdeAddressBookNumber(this.accountnumber).subscribe({
          next: (data: any) => {
            this.jdeAddressBookNumber = data;
            this.pdfpath = environment.statementPath + this.title + 'Statements' + "/" + this.cropyear + "/" + this.title + "_Statement_" + this.calculationbatchid + '_' + this.jdeAddressBookNumber + '_' + this.accountnumber + '.pdf';
            var pdfViewer = document.getElementById('pdf');
            pdfViewer?.setAttribute("src", this.pdfpath);
          },
          error: (err: any) => {
            console.log(err);
          },
        });
        break;
      case CalculationBatchTypes.YearEnd:
        this.pdfpath = environment.statementPath + this.title + 'Statements' + "/" + this.cropyear + "/" + this.title + "_Statement_" + this.accountnumber + '.pdf';
        var pdfViewer = document.getElementById('pdf');
        pdfViewer?.setAttribute("src", this.pdfpath);
        break;
      case CalculationBatchTypes.Deferral:
        debugger;
        var month = new Date(this.deferralDate).getMonth().toString();
        var year = new Date(this.deferralDate).getFullYear().toString();
        var monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];


        ;
        this.pdfpath = environment.statementPath + this.title + 'Statements' + "/" + this.cropyear + "/" + monthNames[parseInt(month)] + year + "/" + this.accountnumber + '.pdf';
        var pdfViewer = document.getElementById('pdf');
        pdfViewer?.setAttribute("src", this.pdfpath);
        break;
    }

  }


  GetBatches() {
    if (this.accountnumber.trim() != '' && this.calculationBatchType != CalculationBatchTypes.Deferral && this.calculationBatchType != CalculationBatchTypes.YearEnd)
      this.reportService
        .GetBatches({
          cropyear: this.cropyear,
          accountnumber: this.accountnumber,
          batchType: this.calculationBatchType,
        })
        .subscribe({
          next: (data: any) => {
            this.calculationbatches = [];
            let new_list = data.calculations.map((obj: any) => {
              return {
                Id: obj.Id,
                Title: obj.Title,
              };
            });
            this.calculationbatches = new_list;
          },
          error: (err: any) => {
            console.log(err);
          },
        });
  }

  GetdateFormated(data: any) {
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
    let ticketInfoData = this.ticketInfo.map((obj: any) => {
      return {
        DeliveryNumber: obj.DeliveryNumber,
        varietyName: obj.varietyName,
        DeliveryDate: obj.DeliveryDate,
        NetWeight: obj.NetWeight,
        PercentEdibleYield: obj.PercentEdibleYield,
        PercentJumboSound: obj.PercentJumboSound,
        PercentOffGrade: obj.PercentOffGrade,
        ExternalType: obj.ExternalType,
        PercentInsect: obj.PercentInsect,
        PercentMold: obj.PercentMold,
        PercentBlow: obj.PercentBlow,
        PercentLightKerenels: obj.PercentLightKerenels,
        PercentLightAmberKernels: obj.PercentLightAmberKernels,
        PercentAmberDarkKernels: obj.PercentAmberDarkKernels,
        Incentive: obj.Incentive,
        InshellValue: obj.InshellValue,
        KernelValue: obj.KernelValue,
        Payment: obj.Payment,
      };
    });

    let paymentInfoColumns = [
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Date',
      'Check #',
      'Payee',
      'Payee %',
      'Description',
      'Payee $',
      'Account Total',


    ];


    let paymentInfoData = this.paymentInfo.map((obj: any) => {
      return {
        Empty1: '',
        Empty2: '',
        Empty3: '',
        Empty4: '',
        Empty5: '',
        Empty6: '',
        Empty7: '',
        Empty8: '',
        Empty9: '',
        Empty10: '',
        Empty11: '',


        Date: obj.Date,

        Check: obj.Check,
        Payee: obj.Payee,
        allocationpercent: obj.allocationpercent,
        Description: obj.Description,
        payeeshare: obj.payeeshare,
        totalAmount: obj.totalAmount


      };
    });

    let growerInfoColumns: any[][] = [];

    growerInfoColumns.push(['Crop Year - ', this.cropyear]);
    growerInfoColumns.push(['Account Number - ', this.accountnumber]);
    growerInfoColumns.push([
      'Grower Account #	 - ',
      this.growerInfo.RootAccountNumber,
    ]);
    growerInfoColumns.push(['Account Name - ', this.growerInfo.Name]);
    growerInfoColumns.push([
      '',
      this.growerInfo.AddressLine1 + ' ' + this.growerInfo.AddressLine2,
    ]);
    growerInfoColumns.push([
      '',
      this.growerInfo.City.trim() +
      ', ' +
      this.growerInfo.StateAbbreviation +
      ' ' +
      this.growerInfo.PostalCode,
    ]);


    let ticketInfoColumns: any[];
    let ticketInfoTopColumn: any = [];

    ticketInfoTopColumn = ['', '', '', '', '', '', '', '', '', 'Serious Damage', '', '', '', '', '', '', '', '']

    ticketInfoColumns = this.reportHeaders;
    ticketInfoColumns = [
      'Delivery#',
      'Variety',
      'Date',
      'Inshell Wt',
      '% Ey',
      '% J Snd',
      '% Ofg',
      'Type',
      'Insc %',
      '% Other Damage',
      '% Blow',
      '% Light+',
      '% Lt Am',
      '% Am Dk',
      'Incentive',
      'Inshell Price',
      'Kernel Value',
      'Total Value',
    ];


    this.excelService.exportAsExcelFileDeliveryReport(
      this.title,
      '',
      ticketInfoColumns,
      ticketInfoData,
      [],
      this.title +
      '_' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      this.title,
      growerInfoColumns,
      ticketInfoTopColumn,
      [],//2nd sheet data
      '',// 2nd sheet Name
      [],// 2nd sheet header array
      paymentInfoData,
      paymentInfoColumns,
      //new_list2,
      []
    );
  }
  exportToPDF() {
    this.reportService
      .PaymentReport({
        cropyear: this.cropyear,
        accountnumber: this.accountnumber,
        calculationbatchid: this.calculationbatchid,
        calculationBatchType: this.calculationBatchType,
      })
      .subscribe({
        next: (data: any) => {
          this.accountData.push(data);
        },
        error: (err: any) => {
          console.log(err);
        },
        complete: () => {
          if (this.accountData.length == 1) {
            this.GeneratePDFForPaymentReport();
          }
        },
      });
  }

  GeneratePDFForPaymentReport() {
    //
    try {
      if (this.accountData.length == 0) {
        Swal.fire({
          html: 'No data found for selected batch',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
        return;
      }
      var doc = new jsPDF('l', 'mm', 'a3', true);
      var fileName: string =
        'Bulk Print ' +
        formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800');
      var progressPaymentHeader = this.cropyear + ' Crop Feb ' + new Date().getFullYear() % 100 + ' Progress Payment';

      switch (this.calculationBatchType) {
        case 3:
          fileName =
            'Delivery_statement_' + this.calculationbatchid + '_' + this.growerInfo.JDEAddressBookNumber + '_' + this.accountnumber;
          progressPaymentHeader = this.cropyear + ' Crop Delivery \'' + new Date().getFullYear() % 100 + ' Progress Payment';

          break;
        case 4:
          fileName =
            'February_statement_' + this.calculationbatchid + '_' + this.growerInfo.JDEAddressBookNumber + '_' + this.accountnumber;
          progressPaymentHeader = this.cropyear + ' Crop Feb \'' + new Date().getFullYear() % 100 + ' Progress Payment';

          break;
        case 5:
          fileName =
            'May_statement_' + this.calculationbatchid + '_' + this.growerInfo.JDEAddressBookNumber + '_' + this.accountnumber;
          progressPaymentHeader = this.cropyear + ' Crop May \'' + new Date().getFullYear() % 100 + ' Progress Payment';

          break;
        case 6:
          fileName =
            'Final_statement_' + this.calculationbatchid + '_' + this.growerInfo.JDEAddressBookNumber + '_' + this.accountnumber;
          progressPaymentHeader = this.cropyear + ' Crop Final \'' + new Date().getFullYear() % 100 + ' Progress Payment';

          break;
        case 10:
          fileName =
            'Spot_statement_' + this.calculationbatchid + '_' + this.growerInfo.JDEAddressBookNumber + '_' + this.accountnumber;
          progressPaymentHeader = this.cropyear + ' Crop SPOT \'' + new Date().getFullYear() % 100 + ' Progress Payment';

          break;
      }


      // IN loop
      var prevoiousPageCount = 0;

      this.accountData.forEach((currentValue: any, index1: any) => {
        ///////
        //
        if (index1 > 0)
          doc.addPage('l');
        var rptGrowerInfo: any = currentValue.growerInfo[0];
        var rptTicketInfo: any = currentValue.ticketInfo;
        var rptPaymentInfo: any = currentValue.paymentInfo;
        //var calculations: any = currentValue.calculations[0];
        //var deferred: any = currentValue.deferrals[0];
        var reportHeaders: any = [];

        let ticketInfoList = rptTicketInfo.map((obj: any) => {
          return {
            DeliveryNumber: obj.DeliveryNumber,
            varietyName: obj.varietyName,
            DeliveryDate: obj.DeliveryDate,
            NetWeight: obj.NetWeight,
            PercentEdibleYield: obj.PercentEdibleYield,
            PercentJumboSound: obj.PercentJumboSound,
            PercentOffGrade: obj.PercentOffGrade,
            ExternalType: obj.ExternalType,
            PercentInsect: obj.PercentInsect,
            PercentMold: obj.PercentMold,
            PercentBlow: obj.PercentBlow,
            PercentLightKerenels: obj.PercentLightKerenels,
            PercentLightAmberKernels: obj.PercentLightAmberKernels,
            PercentAmberDarkKernels: obj.PercentAmberDarkKernels,
            Incentive: obj.Incentive,
            InshellValue: obj.InshellValue,
            KernelValue: obj.KernelValue,
            Payment: obj.Payment, //formatCurrency(, this.locale, 'USD'),
          };
        });
        var arr: any[][] = [];
        for (var i: number = 0; i < ticketInfoList.length; i++) {
          arr[i] = [];
          arr[i][0] = ticketInfoList[i].DeliveryNumber;
          arr[i][1] = ticketInfoList[i].varietyName;
          arr[i][2] = ticketInfoList[i].DeliveryDate;
          arr[i][3] = formatNumber(ticketInfoList[i].NetWeight, this.locale);
          arr[i][4] = ticketInfoList[i].PercentEdibleYield;
          arr[i][5] = ticketInfoList[i].PercentJumboSound;
          arr[i][6] = ticketInfoList[i].PercentOffGrade;
          arr[i][7] = ticketInfoList[i].ExternalType;
          arr[i][8] = ticketInfoList[i].PercentInsect;
          arr[i][9] = ticketInfoList[i].PercentMold;
          arr[i][10] = ticketInfoList[i].PercentBlow;
          arr[i][11] = ticketInfoList[i].PercentLightKerenels;
          arr[i][12] = ticketInfoList[i].PercentLightAmberKernels;
          arr[i][13] = ticketInfoList[i].PercentAmberDarkKernels;
          arr[i][14] = ticketInfoList[i].Incentive;
          arr[i][15] = ticketInfoList[i].InshellValue;
          arr[i][16] = ticketInfoList[i].KernelValue;
          arr[i][17] = formatCurrency(ticketInfoList[i].Payment, this.locale, '$');
        }

        var paymentInfoData: any[][] = [];
        let paymentInfoHeader: any = [

          { content: 'Date', styles: { halign: 'center' } },
          { content: 'Check #', styles: { halign: 'center' } },
          { content: 'Payee', styles: { halign: 'center' } },
          { content: 'Payee %', styles: { halign: 'center' } },
          { content: 'Description', styles: { halign: 'center' } },
          { content: 'Payee $', styles: { halign: 'center' } },
          { content: 'Account Total', styles: { halign: 'center' } }
        ];

        var statementDate: any;

        let index;
        for (index = 0; index < rptPaymentInfo.length; index++) {
          if (rptPaymentInfo[index].Date != null && rptPaymentInfo[index].Date != undefined) {
            statementDate = rptPaymentInfo[index].Date;
          }
          paymentInfoData.push([
            rptPaymentInfo[index].Date,
            rptPaymentInfo[index].Check,
            rptPaymentInfo[index].Payee,
            rptPaymentInfo[index].allocationpercent,
            rptPaymentInfo[index].Description,
            rptPaymentInfo[index].payeeshare != null ? formatCurrency(rptPaymentInfo[index].payeeshare, this.locale, '$') : '',
            rptPaymentInfo[index].totalAmount != null ? formatCurrency(rptPaymentInfo[index].totalAmount, this.locale, '$') : '',
          ]);


        }


        let head = reportHeaders;
        head = [
          'Delivery #',
          'Variety',
          'Date',
          'Inshell Wt',
          '% Ey',
          '% J Snd',
          '% Ofg',
          'Type',
          'Insc %',
          '% Other Damage',
          '% Blow',
          '% Light+',
          '% Lt Am',
          '% Am Dk',
          'Incentive',
          'Inshell Price',
          'Kernel Value',
          'Total Value',
        ];
        let masterHead = [

          { content: '', colSpan: 8, styles: { halign: 'center', fillColor: [255, 255, 255] } },
          { content: 'Serious Damage', colSpan: 3, styles: { halign: 'center', fillColor: [211, 211, 211] } },
          { content: '', colSpan: 7, styles: { halign: 'center', fillColor: [255, 255, 255] } }
        ];
        let growerInfoColumns: any[][] = [];
        let addressDetails: any[][] = [];


        growerInfoColumns.push(['Statement Date : ' + statementDate]);
        growerInfoColumns.push(['Account Number : ' + rptGrowerInfo.AccountNumber]);
        //growerInfoColumns.push(['', this.cropyear + ' Crop Feb '+ new Date().getFullYear()+ ' Progress Payment']);


        growerInfoColumns.push([rptGrowerInfo.Name]);

        growerInfoColumns.push([
          rptGrowerInfo.AddressLine1 + ' ' + rptGrowerInfo.AddressLine2,
        ]);
        growerInfoColumns.push([
          rptGrowerInfo.City.trim() +
          ', ' +
          rptGrowerInfo.StateAbbreviation +
          ' ' +
          rptGrowerInfo.PostalCode,
        ]);
        addressDetails.push([rptGrowerInfo.Name]);
        addressDetails.push([rptGrowerInfo.AddressLine1]);
        addressDetails.push([rptGrowerInfo.AddressLine2]);
        addressDetails.push([rptGrowerInfo.AddressLine3]);
        addressDetails.push([
          rptGrowerInfo.City.trim() +
          ', ' +
          rptGrowerInfo.StateAbbreviation +
          ' ' +
          rptGrowerInfo.PostalCode,
        ]);

        /////
        var jsonData: any = arr;


        var header: any[] = head;
        var headerText: string = '';
        var reportFilterData: any = growerInfoColumns;
        var reportheader: any[] = ['', ''];
        var columnStyle: any = {
          3: { halign: 'right' },
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
          16: { halign: 'right' },
          17: { halign: 'right' },
        };

        //doc.roundedRect(doc.internal.pageSize.height - 215, 160, 40, 100, 5, 5, 'S')
        doc.setFontSize(15);
        var addrPosition = 205;
        doc.text(addressDetails[0] == null ? '' : addressDetails[0], doc.internal.pageSize.height - addrPosition, 275, { angle: 90 });
        if (addressDetails[1].toString() != '') {
          addrPosition = addrPosition - 7;
          doc.text(addressDetails[1], doc.internal.pageSize.height - addrPosition, 275, { angle: 90 });

        }
        if (addressDetails[2].toString() != '') {
          addrPosition = addrPosition - 7;
          doc.text(addressDetails[2], doc.internal.pageSize.height - addrPosition, 275, { angle: 90 });
        }

        if (addressDetails[3].toString() != '') {
          addrPosition = addrPosition - 7;
          doc.text(addressDetails[3], doc.internal.pageSize.height - addrPosition, 275, { angle: 90 });
        }
        if (addressDetails[4].toString() != '') {
          addrPosition = addrPosition - 7;
          doc.text(addressDetails[4], doc.internal.pageSize.height - addrPosition, 275, { angle: 90 });
        }
        autoTable(doc, {
          head: [],
          body: [],
          theme: 'plain',
          bodyStyles: {},
        });
        // if (format == 'a3') {
        if (reportFilterData != null) {
          autoTable(doc, {
            head: [reportheader],
            body: reportFilterData,
            theme: 'plain',
            pageBreak: 'always',
            willDrawCell: (data) => {
              if (data.row.raw.toString().indexOf('Progress Payment') > 0) {
                doc.setFont('Helvetica', 'bold');
              }
            }
          });
        }

        autoTable(doc, {
          head: masterHead.length > 0 ? [masterHead, header] : [header],
          body: jsonData,
          theme: 'striped',
          headStyles: {
            halign: 'center',
            valign: 'middle',
            fillColor: [211, 211, 211],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            lineWidth: { top: 0.1, right: 0.1, left: 0.1, bottom: 0.05 },
            lineColor: [0, 0, 0]
          },
          //startY: doc.getCurrentPageInfo().pageNumber == 0 ? 30 : 50,
          margin: { top: 30 },
          rowPageBreak: 'avoid',
          showHead: 'firstPage',
          willDrawCell: (data) => {
            if (data.row.raw.toString().indexOf('Account Total') > 0 || data.row.raw.toString().indexOf('Variety Total') > 0) {
              doc.setFont('Helvetica', 'bold').setTextColor('black');
            }
          },
          columnStyles: columnStyle,
        });

        //var startingPage = doc.getCurrentPageInfo().pageNumber;

        autoTable(doc, {
          head: [paymentInfoHeader],
          body: paymentInfoData,
          theme: 'striped',
          headStyles: {
            halign: 'center',
            valign: 'middle',
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0],
            fontStyle: 'bold'
          },
          columnStyles: {
            0: { halign: 'center' },
            1: { halign: 'center' },
            2: { halign: 'left' },
            3: { halign: 'center' },
            4: { halign: 'center' },
            5: { halign: 'right' },
            6: { halign: 'right' }
          },
          rowPageBreak: 'avoid',
          margin: { top: doc.getCurrentPageInfo().pageNumber == 0 ? 0 : 30 },
          willDrawCell: (data) => {
            if (data.row.raw.toString().indexOf('NET PAYMENT') > 0 || data.row.raw.toString().indexOf('DEFERRED') > 0) {
              doc.setFont('Helvetica', 'bold').setTextColor('black');
            }
          },
          tableLineWidth: 0.2,
          tableLineColor: [0, 0, 0],
          //tableWidth : (doc.internal.pageSize.width / 2) - 20,
          //margin: {right: doc.internal.pageSize.width / 2 - 20}
        });

        var pageCount = doc.getCurrentPageInfo().pageNumber; //Total Page Number

        let pageCurrent = 1;

        var pageCountToLoop = pageCount - prevoiousPageCount;
        // console.log(prevoiousPageCount);
        // console.log(pageCountToLoop);
        for (var i = 1; i < pageCountToLoop; i++) {
          doc.setPage(prevoiousPageCount + i + 1);
          //console.log(prevoiousPageCount + i + 1)
          doc.setFont('Helvetica', '', 'bold');
          doc.setTextColor('#5A5A5A');
          doc.setFontSize(15);


          doc.setFontSize(8);
          doc.text(
            'Page ' + pageCurrent + ' of ' + (pageCountToLoop - 1),
            (doc.internal.pageSize.width / 2) - 10,
            doc.internal.pageSize.height - 10
          );
          console.log('Page ' + pageCurrent + ' of ' + (pageCountToLoop - 1));
          doc.setFontSize(8);
          var img = new Image();
          img.src = '/assets/media/logos/DoC_Logo.png';
          doc.addImage(img, 'png', doc.internal.pageSize.width - 49, 2, 30, 15);
          doc.text('Diamond Foods LLC', doc.internal.pageSize.width - 47, 20);
          doc.text('1050 Diamond St', doc.internal.pageSize.width - 47, 24);
          doc.text('Stockton, CA 95205', doc.internal.pageSize.width - 47, 28);
          // console.log(doc.internal.pageSize.width + ' %%% ' + progressPaymentHeader + ' $$$ ' + ((doc.internal.pageSize.width / 2) - (progressPaymentHeader.length / 2)))
          doc.setFontSize(10).setTextColor('black');
          doc.text(progressPaymentHeader
            ,
            (doc.internal.pageSize.width / 2) - (progressPaymentHeader.length / 2) - 18,
            10
          );
          pageCurrent = pageCurrent + 1;
        }
        prevoiousPageCount = prevoiousPageCount + (pageCount - prevoiousPageCount);

        console.log('prevoiousPageCount: ' + prevoiousPageCount);
      });
      //doc.deletePage(doc.getNumberOfPages());
      doc.save(fileName);
    }
    catch (Error) { console.log('test') }
    //this.loadingService.setLoading(false);

  }
}

