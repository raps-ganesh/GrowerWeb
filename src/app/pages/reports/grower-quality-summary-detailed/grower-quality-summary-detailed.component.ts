import { formatNumber, formatDate, formatCurrency } from '@angular/common';
import { Component, Inject, Input, LOCALE_ID, OnInit, ViewChild } from '@angular/core';
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
  styleUrls: ['./grower-quality-summary-detailed.component.scss']
})
export class GrowerQualitySummaryDetailedComponent implements OnInit {
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





  totalNet_count: number = 0;
  allTotal: number = 0;
  allNetWeight: number = 0;
  accountNumber :any='' ;
  reportData2: any;
  sortcolumn: string = 'Id';
  sortdirection: string = 'ASC';
  pagenumber: number = 1;
  pagesize: number = 10;
  searchstring: string = '';
  selected_count: number = 0;
  colorImagePath:string ="";
  classImagePath:string ="";

  @ViewChild('modalImage') public modalImageComponent: ModalComponent;

  modalConfig: ModalConfig = {
    modalTitle: 'Image',
    size: 'xl',
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
  ) {
    var calcBatchType =
      this.router.url.split('/')[2] != null
        ? this.router.url.split('/')[2]
        : 'Delivery';
    //
    switch (calcBatchType.toLowerCase()) {
      case 'Delivery'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.Delivery;
        this.title = 'Delivery';
        break;
      case 'Spotemf'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.SpotEMF;
        this.title = 'Spot EMF';
        break;
      case 'FebProgress'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.FebProgress;
        this.title = 'February';
        break;
      case 'MayProgress'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.MayProgress;
        this.title = 'May';
        break;
      case 'FinalPayment'.toLowerCase():
        this.calculationBatchType = CalculationBatchTypes.FinalPayment;
        this.title = 'Final';
        break;
    }
  }

  public getSanitizeUrl(url: string): SafeUrl {
    debugger;
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  loadDataFromMasterMenu(_accountnumber: any) {
    this.isEnabled = true;
    this.accountnumber = _accountnumber;
   
  }

  ngOnInit(): void {
    if (this.eventEmitterService.subsVar == undefined) {
      this.eventEmitterService.subsVar = this.eventEmitterService.
        invokeFirstComponentFunction.subscribe((name: string) => {
          this.loadDataFromMasterMenu(name);
        });
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
  filterByCropYear(event: any) {
    
  }
  filterByAcc(acct: any) {
    var data = this.reportData.filter((x: any) => x.accountNo == acct);
    this.selected_count = data.length;
    // this.totalNet_count= data.filter((g)=>{
    //   this.totalNet_count = this.totalNet_count + g.netWeight;
    // });
    this.totalNet_count = 0;
    data.forEach((g: any) => {
      this.totalNet_count = parseInt(this.totalNet_count.toString()) + parseInt(g.netWeight == null ? '0' : g.netWeight.toString());
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



  ShowImage(imagepath:any, classpath:any)
  {
    
    this.colorImagePath= environment.imagePathUrl+`${imagepath}`;
    this.classImagePath= environment.imagePathUrl+`${classpath}`;

    this.modalImageComponent.open();
  }
  imageErrordispaly() {
    console.log('Image not available..');
    // $("#colorImages").css('display', 'none');
    // $("#errorColorImages").css('display', 'block');
    // $("#imageModalContent").css('height', '200px');
  }

  getGrowerNonDeliveryReport(
    sortcolumn: string,
    sortdirection: string,
    searchstring: string,
    pagenumber: number,
    pagesize: number
  ) {
    this.allTotal=0;
    this.totalNet_count=0;
    this.allNetWeight=0;

    this.reportService
      .GetGrowerQualitySummaryDetailed({
        sortcolumn: sortcolumn,
        sortdirection: sortdirection,
        pagenumber: pagenumber,
        searchstring: searchstring,
        pagesize: pagesize,
        cropyear: this.cropyear,
        accountNo:this.accountNumber
      })
      .subscribe({
        next: (data: any) => {
          debugger;
          this.reportData = data[0];

          this.reportData2 = data[1]
          this.reportData.forEach((g: any) => {
            this.allNetWeight = parseInt(this.allNetWeight.toString()) + parseInt(g.netWeight == null ? '0' : g.netWeight.toString());
          });
          this.allTotal = data[0].length;

          // this.sortcolumn = sortcolumn;
          // this.sortdirection = sortdirection;
          // this.pagenumber = pagenumber;
          // this.searchstring = searchstring;
          // this.datacount = this.reportData.length;

          // this.pagesize = pagesize;
          // this.pagingArray = this.appSettingService.paging(
          //   this.pagecount,
          //   this.pagenumber,
          //   this.totalrecords,
          //   this.pagesize
          // );
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
    let reportHeaders: any = this.cropyear < 2022 ? ['FD8#', 'Variety Name', 'Receiving Date', 'Grading', 'Net Weight'
    , '% Jumbo'
    , '% Med Baby'
    , '% Edible'
    , 'RLI'
    , '% Insect'
    , '% Blow'
    , '% Ofg'
    , 'Ofg Dam'
    , '% Ext Dam'
    , 'Ext Dam'
  ]
  :['FD8#', 'Variety Name', 'Receiving Date', 'Grading', 'Net Weight'
  , '% Jumbo'
  , '% Med Baby'
  , '% Edible'
  , '% Extra Light', '% Light', '% Light Amber', '% Amber', '% Amber Dark'
  , '% Insect'
  , '% Blow'
  , '% Ofg'
  , 'Ofg Dam'
  , '% Ext Dam'
  , 'Ext Dam'
];

    let columns: any[];
    let mainHeaderColumn: any = [];
    let SearchColumns: any[][] = [];
    SearchColumns.push(['Account No ',this.accountNumber]);
    SearchColumns.push(['Crop Year ',this.cropyear]);
    columns = reportHeaders;
    let new_list; 
    debugger;
    if (this.cropyear < 2022)
    {
      new_list = this.reportData.map(function (obj: any) {
        return {
          name: obj.name
          ,accountNo : obj.accountNo
          ,ticketNumber : obj.ticketNumber 
          ,varietyName : obj.varietyName 
          ,receivingDate : obj.receivingDate 
          ,gradingTicketType  : obj.gradingTicketType
          ,netWeight : obj.netWeight
          ,percentJumboSound : obj.percentJumboSound
          ,medbaby : obj.medbaby
          ,percentEdibleYield : obj.percentEdibleYield
          ,rli : obj.rli
          ,percentInsect : obj.percentInsect
          ,percentBlowable : obj.percentBlowable
          ,percentOffGrade  : obj.percentOffGrade
          ,predominantOffgradeDamage : obj.predominantOffgradeDamage
          ,percentExternalDamage : obj.percentExternalDamage
          ,predominantExternalDamage : obj.predominantExternalDamage 

        };
      });
    }
  else
  {
    new_list = this.reportData.map(function (obj: any) {
      return {
        name: obj.name
        ,accountNo : obj.accountNo
        ,ticketNumber : obj.ticketNumber 
        ,varietyName : obj.varietyName 
        ,receivingDate : obj.receivingDate 
        ,gradingTicketType  : obj.gradingTicketType
        ,netWeight : obj.netWeight
        ,percentJumboSound : obj.percentJumboSound
        ,medbaby : obj.medbaby
        ,percentEdibleYield : obj.percentEdibleYield
        ,percentExtraLightKernel : obj.percentExtraLightKernel
        ,percentLightKernel : obj.percentLightKernel
        ,percentLightAmberKernel : obj.percentLightAmberKernel
        ,percentAmberKernel : obj.percentAmberKernel
        ,percentDarkKernel : obj.percentDarkKernel
        ,percentInsect : obj.percentInsect
        ,percentBlowable : obj.percentBlowable
        ,percentOffGrade  : obj.percentOffGrade
        ,predominantOffgradeDamage : obj.predominantOffgradeDamage
        ,percentExternalDamage : obj.percentExternalDamage
        ,predominantExternalDamage : obj.predominantExternalDamage 
      };
    });
  }
    
    var exportData: any = [];


    this.reportData.forEach((element: any) => {
      exportData.push(element);
    });

    this.excelService.exportAsExcelFileGrowerQuality(
      'Grower Quality Summary Detailed',
      '',
      columns,
      new_list,
      [],
      'GrowerQualitySummaryDetailed_Report_' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      'Grower Quality Summary Detailed',
      SearchColumns,
      mainHeaderColumn,
      this.reportData2,
      'Grower Quality Summary Detailed2',
      this.cropyear
    );
  }

  exportToPDF() {
    let reportHeadersPDF: any = this.cropyear < 2022 ? ['Name','Account No','FD8#', 'Variety Name', 'Receiving Date', 'Grading', 'Net Weight'
    , '% Jumbo'
    , '% Med Baby'
    , '% Edible'
    , 'RLI'
    , '% Insect'
    , '% Blow'
    , '% Ofg'
    , 'Ofg Dam'
    , '% Ext Dam'
    , 'Ext Dam'
  ] :
  ['Name','Account No','FD8#', 'Variety Name', 'Receiving Date', 'Grading', 'Net Weight'
    , '% Jumbo'
    , '% Med Baby'
    , '% Edible'
    , '% Extra Light', '% Light', '% Light Amber', '% Amber', '% Amber Dark'
    , '% Insect'
    , '% Blow'
    , '% Ofg'
    , 'Ofg Dam'
    , '% Ext Dam'
    , 'Ext Dam'
  ];
    let SearchColumns:any[][]=[];
    SearchColumns.push(['Account Number - '+this.accountNumber]);
    SearchColumns.push(['Crop Year - '+this.cropyear]);

    debugger;
    var arr: any[][] = [];

    if (this.cropyear < 2022)
    {
    for (var i: number = 0; i < this.reportData.length; i++) {
      arr[i] = [];
      arr[i][0] = this.reportData[i].name 
      arr[i][1] = this.reportData[i].accountNo
      arr[i][2] = this.reportData[i].ticketNumber 
      arr[i][3] = this.reportData[i].varietyName 
      arr[i][4] = this.reportData[i].receivingDate 
      arr[i][5] = this.reportData[i].gradingTicketType 
      arr[i][6] = formatNumber(this.reportData[i].netWeight,this.locale)
      arr[i][7] = this.reportData[i].percentJumboSound+'%'
      arr[i][8] = this.reportData[i].medbaby +'%'
      arr[i][9] = this.reportData[i].percentEdibleYield +'%'
      arr[i][10] = this.reportData[i].rli 
      arr[i][11] = this.reportData[i].percentInsect +'%'
      arr[i][12] = this.reportData[i].percentBlowable +'%'
      arr[i][13] = this.reportData[i].percentOffGrade +'%'
      arr[i][14] = this.reportData[i].predominantOffgradeDamage 
      arr[i][15] = this.reportData[i].percentExternalDamage +'%'
      arr[i][16] = this.reportData[i].predominantExternalDamage 
    }
  }
  else
  {
    for (var i: number = 0; i < this.reportData.length; i++) {
      arr[i] = [];
      arr[i][0] = this.reportData[i].name 
      arr[i][1] = this.reportData[i].accountNo
      arr[i][2] = this.reportData[i].ticketNumber 
      arr[i][3] = this.reportData[i].varietyName 
      arr[i][4] = this.reportData[i].receivingDate 
      arr[i][5] = this.reportData[i].gradingTicketType 
      arr[i][6] = formatNumber(this.reportData[i].netWeight,this.locale)
      arr[i][7] = this.reportData[i].percentJumboSound+'%'
      arr[i][8] = this.reportData[i].medbaby +'%'
      arr[i][9] = this.reportData[i].percentEdibleYield +'%'
      arr[i][10] = this.reportData[i].percentExtraLightKernel  +'%'
      arr[i][11] = this.reportData[i].percentLightKernel  +'%'
      arr[i][12] = this.reportData[i].percentLightAmberKernel  +'%'
      arr[i][13] = this.reportData[i].percentAmberKernel  +'%'
      arr[i][14] = this.reportData[i].percentDarkKernel  +'%'
      arr[i][15] = this.reportData[i].percentInsect +'%'
      arr[i][16] = this.reportData[i].percentBlowable +'%'
      arr[i][17] = this.reportData[i].percentOffGrade +'%'
      arr[i][18] = this.reportData[i].predominantOffgradeDamage 
      arr[i][19] = this.reportData[i].percentExternalDamage +'%'
      arr[i][20] = this.reportData[i].predominantExternalDamage 
  }
}
    let head = reportHeadersPDF;

    var columnStyleRli: any = {
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
      17: { halign: 'right' }      
    };

    
    var columnStyle: any = {
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
      20: { halign: 'right' }         
    };


    this.exportService.expoertToPdf(
      arr,
      'GrowerQualitySummaryDetailed_Report_' +
      formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '-0800'),
      head,
      'Grower Quality Summary Detailed',
      'l',
      SearchColumns,
      ['', ''],
      [],'a2', this.cropyear < 2022 ? columnStyleRli : columnStyle
    );
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

