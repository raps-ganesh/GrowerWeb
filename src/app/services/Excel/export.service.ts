import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx'; // npm install xlsx --save
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor(public authHttpService: AuthHTTPService) { }
  fileType =
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  fileExtension = '.xlsx';
  public exportExcel(jsonData: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData, {
      skipHeader: false,
    });
    const wb: XLSX.WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(wb, {
      bookType: 'xlsx',
      type: 'array',
    });

    this.saveExcelFile(excelBuffer, fileName);
  }

  private saveExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: this.fileType });
    FileSaver.saveAs(data, fileName + this.fileExtension);
  }

  public expoertToPdf(
    jsonData: any,
    fileName: string,
    header: any[],
    headerText: string = '',
    orientation: string = 'portrait',
    reportFilterData: any = null,
    reportheader: any[] = [],
    masterHead: any[] = [],
    format: any = 'a4',
    columnStyle: any = {},
    masterHead3: any[] = []
  ) {
    const doc = new jsPDF(orientation == 'portrait' ? 'p' : 'l', 'mm', format);
    doc.setFont("Helvetica");
    if (reportFilterData != null) {
      autoTable(doc, {
        head: [reportheader],
        body: reportFilterData,
        theme: 'plain',
        styles: {
          halign: 'justify',
          font: 'Helvetica'
        },
        margin: { top: 30 },
      });
    }

    if (masterHead3.length > 0) {
      autoTable(doc, {
        head: masterHead.length > 0 ? [masterHead3, masterHead, header] : [header],
        body: jsonData,
        theme: 'grid',
        headStyles: {
          halign: 'center',
          valign: 'middle',
        },
        // didParseCell: (hookData) => {
        //     debugger;
        //     if (hookData.section === 'head') {
        //         if (hookData.column.dataKey === '4') {
        //             hookData.cell.styles.halign = 'right';
        //         }
        //     }
        // },
        margin: { top: 30 },
        columnStyles: columnStyle,
      });
    }
    else {
      autoTable(doc, {
        head: masterHead.length > 0 ? [masterHead, header] : [header],
        body: jsonData,
        theme: 'striped',
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fillColor : [211,211,211],
          textColor: [0,0,0],
          fontStyle: 'normal',
          lineWidth : { top: 0.1, right: 0.1, left : 0.1, bottom:0.05 },
          lineColor : [0,0,0]
        },
        showHead : 'firstPage',
        willDrawCell: (data) => {
          console.log(data.row.raw.toString().indexOf('Account Total'));
          if(data.row.raw.toString().search('Grand Total') === 0){
            doc.setFont('Helvetica','bold');  
          } 
          if(data.row.raw.toString().indexOf('Account Total') > 0){
            doc.setFont('Helvetica','bold');  
          } 
          if(data.row.raw.toString().indexOf('Assignee Name') > 0){
            doc.setFont('Helvetica','bold');  
          }
          if (data.section === 'body' && data.row.index === 0) 
            doc.setFont('Helvetica','bold');
          },
        margin: { top: 30 },
        columnStyles: columnStyle,
      });    
    }



    var pageCount = doc.getNumberOfPages(); //Total Page Number
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', '', 'bold');
      doc.setTextColor('#5A5A5A');
      doc.setFontSize(15);
      // doc.text(
      //   headerText,
      //   doc.internal.pageSize.width / 2 - headerText.length - 10,
      //   10
      // );
      doc.text(headerText, 15, 10);

      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Date and Time : ', 15, 15);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(
        formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800'),
        40,
        15
      );
      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Run By : ', 15, 20);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(this.authHttpService.getLoggedInUserName() ?? "", 30, 20);
      let pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
      doc.setFontSize(8);
      //doc.text('© 2022 - Nut Processing System' , 15, doc.internal.pageSize.height - 10 );

      doc.text(
        'Page ' + pageCurrent + ' of ' + pageCount,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10
      );
      var img = new Image();
      img.src = '/assets/media/logos/DoC_Logo.png';
      doc.addImage(img, 'png', doc.internal.pageSize.width - 49, 2, 30, 15);
      doc.text('Diamond Foods LLC', doc.internal.pageSize.width - 47, 20);
      doc.text('1050 Diamond St', doc.internal.pageSize.width - 47, 24);
      doc.text('Stockton, CA 95205', doc.internal.pageSize.width - 47, 28);
    }
    doc.save(fileName);
  }

  public exportHullerDeliverySummaryToPdf(
    jsonData: any,
    fileName: string,
    header: any[],
    headerText: string = '',
    orientation: string = 'portrait',
    reportFilterData: any = null,
    reportheader: any[] = [],
    masterHead: any[] = [],
    format: any = 'a4',
    columnStyle: any = {},
    masterHead3: any[] = []
  ) {
    const doc = new jsPDF(orientation == 'portrait' ? 'p' : 'l', 'mm', format);
    doc.setFont("Helvetica");
    if (reportFilterData != null) {
      autoTable(doc, {
        head: [reportheader],
        body: reportFilterData,
        theme: 'plain',
        styles: {
          halign: 'justify',
          font: 'Helvetica'
        },
        margin: { top: 30 },
      });
    }

    if (masterHead3.length > 0) {
      autoTable(doc, {
        head: masterHead.length > 0 ? [masterHead3, masterHead, header] : [header],
        body: jsonData,
        theme: 'grid',
        headStyles: {
          halign: 'center',
          valign: 'middle',
        },
        // didParseCell: (hookData) => {
        //     debugger;
        //     if (hookData.section === 'head') {
        //         if (hookData.column.dataKey === '4') {
        //             hookData.cell.styles.halign = 'right';
        //         }
        //     }
        // },
        margin: { top: 30 },
        columnStyles: columnStyle,
      });
    }
    else {
      autoTable(doc, {
        head: masterHead.length > 0 ? [masterHead, header] : [header],
        body: jsonData,
        theme: 'striped',
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fillColor: [211, 211, 211],
          textColor: [0, 0, 0],
          fontStyle: 'normal',
          lineWidth: { top: 0.1, right: 0.1, left: 0.1, bottom: 0.05 },
          lineColor: [0, 0, 0]
        },
        showHead: 'firstPage',
        willDrawCell: (data) => {
          console.log(data.row.raw.toString().indexOf('Account Total'));
          if (data.row.raw.toString().search('Grand Total') === 0) {
            doc.setFont('Helvetica', 'bold');
          }
          if (data.row.raw.toString().indexOf('Account Total') > 0) {
            doc.setFont('Helvetica', 'bold');
          }
          if (data.row.raw.toString().indexOf('Assignee Name') > 0) {
            doc.setFont('Helvetica', 'bold');
          }
         
          if (data.row.raw.toString().indexOf('Grand Total') > 0) {
            doc.setFont('Helvetica', 'bold').setTextColor('black');
          }
          if (data.row.raw.toString().indexOf('Total') > 0) {
            doc.setFont('Helvetica', 'bold').setTextColor('black');
          }
        },


        margin: { top: 30 },
        columnStyles: columnStyle,
      });
    }



    var pageCount = doc.getNumberOfPages(); //Total Page Number
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', '', 'bold');
      doc.setTextColor('#5A5A5A');
      doc.setFontSize(15);
      // doc.text(
      //   headerText,
      //   doc.internal.pageSize.width / 2 - headerText.length - 10,
      //   10
      // );
      doc.text(headerText, 15, 10);

      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Date and Time : ', 15, 15);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(
        formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800'),
        40,
        15
      );
      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Run By : ', 15, 20);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(this.authHttpService.getLoggedInUserName() ?? "", 30, 20);
      let pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
      doc.setFontSize(8);
      //doc.text('© 2022 - Nut Processing System' , 15, doc.internal.pageSize.height - 10 );

      doc.text(
        'Page ' + pageCurrent + ' of ' + pageCount,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10
      );
      var img = new Image();
      img.src = '/assets/media/logos/DoC_Logo.png';
      doc.addImage(img, 'png', doc.internal.pageSize.width - 49, 2, 30, 15);
      doc.text('Diamond Foods LLC', doc.internal.pageSize.width - 47, 20);
      doc.text('1050 Diamond St', doc.internal.pageSize.width - 47, 24);
      doc.text('Stockton, CA 95205', doc.internal.pageSize.width - 47, 28);
    }
    doc.save(fileName);
  }

  public expoertToPdfTruUp(
    jsonData: any,
    fileName: string,
    header: any[],
    headerText: string = '',
    orientation: string = 'portrait',
    reportFilterData: any = null,
    reportheader: any[] = [],
    masterHead: any[] = [],
    format: any = 'a4',
    columnStyle: any = {},
    masterHead3: any[] = []
  ) {
    const doc = new jsPDF(orientation == 'portrait' ? 'p' : 'l', 'mm', format);
    doc.setFont("Helvetica");
    if (reportFilterData != null) {
      autoTable(doc, {
        head: [reportheader],
        body: reportFilterData,
        theme: 'plain',
        styles: {
          halign: 'justify',
          font: 'Helvetica'
        },
        //margin: { top: 30 },
      });
    }

    if (masterHead3.length > 0) {
      autoTable(doc, {
        head: masterHead.length > 0 ? [masterHead3, masterHead, header] : [header],
        body: jsonData,
        theme: 'grid',
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fillColor : [211,211,211],
          textColor: [0,0,0],
          fontStyle: 'bold',
          lineWidth : { top: 0.1, right: 0.1, left : 0.1, bottom:0.05 },
          lineColor : [0,0,0]
        },   
        margin: { top: 30 },
        columnStyles: columnStyle,
      });
    }
    else {
      autoTable(doc, {
        head: masterHead.length > 0 ? [masterHead, header] : [header],
        body: jsonData,
        theme: 'striped',
        headStyles: {
          halign: 'center',
          valign: 'middle',
          fillColor : [211,211,211],
          textColor: [0,0,0],
          fontStyle: 'bold',
          lineWidth : { top: 0.1, right: 0.1, left : 0.1, bottom:0.05 },
          lineColor : [0,0,0]
        },   
        showHead : 'firstPage',
        willDrawCell: (data) => {
          console.log(data.row.raw.toString().indexOf('Account Total'));
          if(data.row.raw.toString().search('Grand Total') === 0){
            doc.setFont('Helvetica','bold');  
          } 
          if(data.row.raw.toString().indexOf('Account Total') > 0){
            doc.setFont('Helvetica','bold');  
          } 
          if(data.row.raw.toString().indexOf('Assignee Name') > 0){
            doc.setFont('Helvetica','bold');  
          }
          if (data.section === 'body' && data.row.index === 0) 
            doc.setFont('Helvetica','bold');
          },
        margin: { top: 30 },
        columnStyles: columnStyle,
      });    
    }



    var pageCount = doc.getNumberOfPages(); //Total Page Number
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', '', 'bold');
      doc.setTextColor('#5A5A5A');
      doc.setFontSize(15);
      // doc.text(headerText, 15, 10);
      // doc.setFontSize(10);
      // doc.setFont('Helvetica', '', 'normal');
      // doc.text('Date and Time : ', 15, 15);
      // doc.setFont('Helvetica', '', 'bold');
      // doc.text(
      //   formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800'),
      //   40,
      //   15
      // );
      // doc.setFontSize(10);
      // doc.setFont('Helvetica', '', 'normal');
      // doc.text('Run By : ', 15, 20);
      // doc.setFont('Helvetica', '', 'bold');
      //doc.text(this.authHttpService.getLoggedInUserName() ?? "", 30, 20);
      let pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
      doc.setFontSize(8);
      //doc.text('© 2022 - Nut Processing System' , 15, doc.internal.pageSize.height - 10 );

      doc.text(
        'Page ' + pageCurrent + ' of ' + pageCount,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10
      );
      var img = new Image();
      img.src = '/assets/media/logos/DoC_Logo.png';
      doc.addImage(img, 'png', doc.internal.pageSize.width - 49, 2, 30, 15);
      doc.text('Diamond Foods LLC', doc.internal.pageSize.width - 47, 20);
      doc.text('1050 Diamond St', doc.internal.pageSize.width - 47, 24);
      doc.text('Stockton, CA 95205', doc.internal.pageSize.width - 47, 28);
    }
    doc.save(fileName);
  }

  public expoertToPdfTwoTable(
    jsonData: any,
    fileName: string,
    header: any[],
    headerText: string = '',
    orientation: string = 'portrait',
    reportFilterData: any = null,
    reportheader: any[] = [],
    masterHead: any[] = [],
    format: any = 'a4',
    columnStyle: any = {},
    header2: any[],
    jsonData2: any,
    masterHead2: any[] = [],
    columnStyle2: any = {}
  ) {
    const doc = new jsPDF(orientation == 'portrait' ? 'p' : 'l', 'mm', format);
    if (reportFilterData != null) {
      autoTable(doc, {
        head: [reportheader],
        body: reportFilterData,
        theme: 'plain',
        headStyles: {
          halign: 'center',
        },
        margin: { top: 30 },
      });
    }

  

    autoTable(doc, {
      head: masterHead.length > 0 ? [masterHead, header] : [header],
      body: jsonData,
      theme: 'striped',
      headStyles: {
        halign: 'center',
        valign: 'middle',
        fillColor : [211,211,211],
        textColor: [0,0,0],
        fontStyle: 'normal',
        lineWidth : { top: 0.1, right: 0.1, left : 0.1, bottom:0.05 },
        lineColor : [0,0,0]
      },      
      showHead : 'firstPage',
      willDrawCell: (data) => {
        console.log(data.row.raw.toString().indexOf('Account Total'));
        if(data.row.raw.toString().search('Grand Total') === 0){
          doc.setFont('Helvetica','bold');  
        } 
        if(data.row.raw.toString().indexOf('Account Total') > 0){
          doc.setFont('Helvetica','bold');  
        } 
        if(data.row.raw.toString().indexOf('Assignee Name') > 0){
          doc.setFont('Helvetica','bold');  
        }
        if (data.section === 'body' && data.row.index === 0) 
          doc.setFont('Helvetica','bold');
        },
      margin: { top: 30 },
      columnStyles: columnStyle,
    });

    autoTable(doc, {
      head: masterHead2.length > 0 ? [masterHead2, header2] : header2.length > 0 ? [header2] : [],
      body: jsonData2,
      theme: 'striped',
      headStyles: {
        halign: 'center',
        valign: 'middle',
        fillColor : [211,211,211],
        textColor: [0,0,0],
        fontStyle: 'normal',
        lineWidth : { top: 0.1, right: 0.1, left : 0.1, bottom:0.05 },
        lineColor : [0,0,0]
      },
      bodyStyles: {
        lineWidth : { top: 0, right: 0.1, left : 0.1, bottom:0 },
        lineColor : [0,0,0],        
      },
      showHead : 'firstPage',
      willDrawCell: (data) => {
        if(data.row.raw.toString().indexOf('Account Total') > 0){
          doc.setFont('Helvetica','bold');  
        } 
        if(data.row.raw.toString().indexOf('Assignee Name') > 0){
          doc.setFont('Helvetica','bold');  
        }
        console.log(data.row.index +' '+ jsonData2.length)
        if(data.row.index == (jsonData2.length - 1)){
          doc.line(
            data.cell.x,
            data.cell.y + data.cell.height,
            data.cell.x + data.cell.width,
            data.cell.y + data.cell.height
          );
          doc.setDrawColor(0, 0, 0); // set the border color
          doc.setLineWidth(1); // set the border with
        }
      },
      margin: { top: 30 },
      columnStyles: columnStyle,      
    });

    

    var pageCount = doc.getNumberOfPages(); //Total Page Number
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', '', 'bold');
      doc.setTextColor('#5A5A5A');
      doc.setFontSize(15);
      // doc.text(
      //   headerText,
      //   doc.internal.pageSize.width / 2 - headerText.length - 10,
      //   10
      // );
      if(headerText != ''){
      doc.text(headerText, 15, 10);
      
      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Date and Time : ', 15, 15);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(
        formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800'),
        40,
        15
      );
      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Run By : ', 15, 20);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(this.authHttpService.getLoggedInUserName() ?? "", 30, 20);
      }
      let pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
      doc.setFontSize(8);
      //doc.text('© 2022 - Nut Processing System' , 15, doc.internal.pageSize.height - 10 );

      doc.text(
        'Page ' + pageCurrent + ' of ' + pageCount,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10
      );
      var img = new Image();
      img.src = '/assets/media/logos/DoC_Logo.png';
      doc.addImage(img, 'png', doc.internal.pageSize.width - 49, 2, 30, 15);
      doc.text('Diamond Foods LLC', doc.internal.pageSize.width - 47, 20);
      doc.text('1050 Diamond St', doc.internal.pageSize.width - 47, 24);
      doc.text('Stockton, CA 95205', doc.internal.pageSize.width - 47, 28);
    }
    doc.save(fileName);
  }

  public expoertToPdfDailyReceivingSummary(
    jsonData: any,
    fileName: string,
    header: any[],
    headerText: string = '',
    orientation: string = 'portrait',
    reportFilterData: any = null,
    reportheader: any[] = [],
    masterHead: any[] = [],
    format: any = 'a4',
    columnStyle: any = {},
    header2: any[],
    jsonData2: any,
    masterHead2: any[] = [],

    header3: any[],
    jsonData3: any,
    masterHead3: any[] = []

  ) {
    const doc = new jsPDF(orientation == 'portrait' ? 'p' : 'l', 'mm', format);
    if (reportFilterData != null) {
      autoTable(doc, {
        head: [reportheader],
        body: reportFilterData,
        theme: 'plain',
        styles: {
          halign: 'justify',
        },
        margin: { top: 30 },
      });
    }

    let SearchColumns: any[][] = [];
    SearchColumns.push(['Daily Receipts vs. History']);


    autoTable(doc, {
      head: [reportheader],
      body: SearchColumns,
      theme: 'plain',
      styles: {
        halign: 'justify',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle'
      },
      margin: { top: 30 },
    });

    autoTable(doc, {
      head: masterHead.length > 0 ? [masterHead, header] : [header],
      body: jsonData,
      theme: 'grid',
      styles: {
        halign: 'justify',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle'
      },
      margin: { top: 30 },
      columnStyles: columnStyle,
    });


    let SearchColumns2: any[][] = [];
    SearchColumns2.push(['Summary of Walnut Pounds by Receiving Date']);
    SearchColumns2.push(['Crop Years 2021 v. 2022'])

    autoTable(doc, {
      head: [reportheader],
      body: SearchColumns2,
      theme: 'plain',
      styles: {
        halign: 'justify',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle'
      },
      margin: { top: 30 },
    });

    autoTable(doc, {
      head: masterHead2.length > 0 ? [masterHead2, header2] : [header2],
      body: jsonData2,
      theme: 'grid',
      styles: {
        halign: 'justify',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle'
      },
      margin: { top: 30 },
      columnStyles: columnStyle,
    });

    autoTable(doc, {
      head: masterHead3.length > 0 ? [masterHead3, header2] : [header3],
      body: jsonData3,
      theme: 'grid',
      styles: {
        halign: 'justify',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle'
      },
      margin: { top: 30 },
      columnStyles: columnStyle,
    });



    var pageCount = doc.getNumberOfPages(); //Total Page Number
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', '', 'bold');
      doc.setTextColor('#5A5A5A');
      doc.setFontSize(15);
      // doc.text(
      //   headerText,
      //   doc.internal.pageSize.width / 2 - headerText.length - 10,
      //   10
      // );
      doc.text(headerText, 15, 10);

      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Date and Time : ', 15, 15);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(
        formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800'),
        40,
        15
      );
      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Run By : ', 15, 20);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(this.authHttpService.getLoggedInUserName() ?? "", 30, 20);
      let pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
      doc.setFontSize(8);
      //doc.text('© 2022 - Nut Processing System' , 15, doc.internal.pageSize.height - 10 );

      doc.text(
        'Page ' + pageCurrent + ' of ' + pageCount,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10
      );
      var img = new Image();
      img.src = '/assets/media/logos/DoC_Logo.png';
      doc.addImage(img, 'png', doc.internal.pageSize.width - 49, 2, 30, 15);
      doc.text('Diamond Foods LLC', doc.internal.pageSize.width - 47, 20);
      doc.text('1050 Diamond St', doc.internal.pageSize.width - 47, 24);
      doc.text('Stockton, CA 95205', doc.internal.pageSize.width - 47, 28);
    }
    doc.save(fileName);
  }

  public expoertToPdfGrowerInspectionDailySummary(
    jsonData: any,
    fileName: string,
    header: any[],
    headerText: string = '',
    orientation: string = 'portrait',
    reportFilterData: any = null,
    reportheader: any[] = [],
    masterHead: any[] = [],
    format: any = 'a4',
    columnStyle: any = {},
    header2: any[],
    jsonData2: any,
    masterHead2: any[] = [],

    header3: any[],
    jsonData3: any,
    masterHead3: any[] = []

  ) {
    const doc = new jsPDF(orientation == 'portrait' ? 'p' : 'l', 'mm', format);
    if (reportFilterData != null) {
      autoTable(doc, {
        head: [reportheader],
        body: reportFilterData,
        theme: 'plain',
        styles: {
          halign: 'justify',
        },
        margin: { top: 30 },
      });
    }

    let SearchColumns: any[][] = [];
    //SearchColumns.push(['Daily Receipts vs. History']);


    autoTable(doc, {
      head: [reportheader],
      body: SearchColumns,
      theme: 'plain',
      styles: {
        halign: 'justify',
      },
      margin: { top: 30 },
    });

    autoTable(doc, {
      head: masterHead.length > 0 ? [masterHead, header] : [header],
      body: jsonData,
      theme: 'grid',
      styles: {
        halign: 'justify',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle'
      },
      margin: { top: 30 },
      columnStyles: columnStyle,
    });


    let SearchColumns2: any[][] = [];
    SearchColumns2.push(['Summary of Walnut Pounds - Received v. Graded']);
    SearchColumns2.push(['Crop Years 2022'])

    debugger;

    autoTable(doc, {
      head: [reportheader],
      body: SearchColumns2,
      theme: 'plain',
      styles: {
        halign: 'justify',
      },
      margin: { top: 30 },
    });

    autoTable(doc, {
      head: masterHead2.length > 0 ? [masterHead2, header2] : [header2],
      body: jsonData2,
      theme: 'grid',
      styles: {
        halign: 'justify',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle'
      },
      margin: { top: 30 },
      columnStyles: columnStyle,
    });

    autoTable(doc, {
      head: masterHead3.length > 0 ? [masterHead3, header3] : [header3],
      body: jsonData3,
      theme: 'grid',
      styles: {
        halign: 'justify',
      },
      headStyles: {
        halign: 'center',
        valign: 'middle'
      },
      margin: { top: 30 },
      columnStyles: columnStyle,
    });



    var pageCount = doc.getNumberOfPages(); //Total Page Number
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', '', 'bold');
      doc.setTextColor('#5A5A5A');
      doc.setFontSize(15);
      // doc.text(
      //   headerText,
      //   doc.internal.pageSize.width / 2 - headerText.length - 10,
      //   10
      // );
      doc.text(headerText, 15, 10);

      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Date and Time : ', 15, 15);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(
        formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800'),
        40,
        15
      );
      doc.setFontSize(10);
      doc.setFont('Helvetica', '', 'normal');
      doc.text('Run By : ', 15, 20);
      doc.setFont('Helvetica', '', 'bold');
      doc.text(this.authHttpService.getLoggedInUserName() ?? "", 30, 20);
      let pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
      doc.setFontSize(8);
      //doc.text('© 2022 - Nut Processing System' , 15, doc.internal.pageSize.height - 10 );

      doc.text(
        'Page ' + pageCurrent + ' of ' + pageCount,
        doc.internal.pageSize.width / 2,
        doc.internal.pageSize.height - 10
      );
      var img = new Image();
      img.src = '/assets/media/logos/DoC_Logo.png';
      doc.addImage(img, 'png', doc.internal.pageSize.width - 49, 2, 30, 15);
      doc.text('Diamond Foods LLC', doc.internal.pageSize.width - 47, 20);
      doc.text('1050 Diamond St', doc.internal.pageSize.width - 47, 24);
      doc.text('Stockton, CA 95205', doc.internal.pageSize.width - 47, 28);
    }
    doc.save(fileName);
  }


  GeneratePDFForPaymentReport(
    jsonData: any,
    fileName: string,
    header: any[],
    headerText: string = '',
    orientation: string = 'portrait',
    reportFilterData: any = null,
    reportheader: any[] = [],
    masterHead: any[] = [],
    format: any = 'a4',
    columnStyle: any = {},
    addressDetails: any[] = []
  ) {
    var doc = new jsPDF(orientation == 'portrait' ? 'p' : 'l', 'mm', format);
    autoTable(doc, {
      head: [],
      body: [],
      theme: 'plain',
      styles: {
        halign: 'justify',
      },
      margin: { top: 30 },
      bodyStyles: {}
    });
    if (format == 'a3') {
      doc.roundedRect(doc.internal.pageSize.height - 215, 160, 40, 100, 5, 5, 'S')
      doc.setFontSize(10);
      doc.text(addressDetails[0], doc.internal.pageSize.height - 205, 245, { angle: 90 });
      doc.text(addressDetails[1], doc.internal.pageSize.height - 200, 245, { angle: 90 });
      doc.text(addressDetails[2], doc.internal.pageSize.height - 195, 245, { angle: 90 });
    }
    if (format == 'a4') {
      doc.roundedRect(doc.internal.pageSize.height - 125, 85, 40, 80, 5, 5, 'S')
      doc.setFontSize(10);
      doc.text(addressDetails[0], doc.internal.pageSize.height - 110, 160, { angle: 90 });
      doc.text(addressDetails[1], doc.internal.pageSize.height - 105, 160, { angle: 90 });
      doc.text(addressDetails[2], doc.internal.pageSize.height - 100, 160, { angle: 90 });
    }
    if (reportFilterData != null) {
      autoTable(doc, {
        head: [reportheader],
        body: reportFilterData,
        theme: 'plain',
        styles: {
          halign: 'justify',
        },
        //margin: { top: 30 },
        pageBreak: 'always'
      });
    }

    autoTable(doc, {
      head: masterHead.length > 0 ? [masterHead, header] : [header],
      body: jsonData,
      theme: 'striped',
      headStyles: {
        halign: 'center',
        valign: 'middle',
        fillColor : [211,211,211],
        textColor: [0,0,0],
        fontStyle: 'bold',
        lineWidth : { top: 0.1, right: 0.1, left : 0.1, bottom:0.05 },
        lineColor : [0,0,0]
      },   
      margin: { top: 30 },   
      showHead : 'firstPage',
      willDrawCell: (data) => {
        console.log(data.row.raw.toString().indexOf('Account Total'));
        if(data.row.raw.toString().search('Grand Total') === 0){
          doc.setFont('Helvetica','bold');  
        } 
        if(data.row.raw.toString().indexOf('Account Total') > 0){
          doc.setFont('Helvetica','bold');  
        } 
        if(data.row.raw.toString().indexOf('Assignee Name') > 0){
          doc.setFont('Helvetica','bold');  
        }
        if(data.row.raw.toString().indexOf('Check #') > 0){
          doc.setFont('Helvetica','bold');  
        }
        },
      columnStyles: columnStyle,

    });


    var pageCount = doc.getNumberOfPages(); //Total Page Number
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i);
      doc.setFont('Helvetica', '', 'bold');
      doc.setTextColor('#5A5A5A');
      doc.setFontSize(15);
      let pageCurrent = doc.getCurrentPageInfo().pageNumber; //Current Page
      if (pageCurrent != 1) {
        // doc.text(headerText, 15, 10);
        // doc.setFontSize(10);
        // doc.setFont('Helvetica', '', 'normal');
        // doc.text('Date and Time : ', 15, 15);
        // doc.setFont('Helvetica', '', 'bold');
        // doc.text(
        //   formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800'),
        //   40,
        //   15
        // );
        // doc.setFontSize(10);
        // doc.setFont('Helvetica', '', 'normal');
        // doc.text('Run By : ', 15, 20);
        // doc.setFont('Helvetica', '', 'bold');
        // doc.text(this.authHttpService.getLoggedInUserName() ?? '', 30, 20);
        doc.setFontSize(8);
        doc.text(
          'Page ' + pageCurrent + ' of ' + pageCount,
          doc.internal.pageSize.width / 2,
          doc.internal.pageSize.height - 10
        );
        var img = new Image();
        img.src = '/assets/media/logos/DoC_Logo.png';
        doc.addImage(img, 'png', doc.internal.pageSize.width - 49, 2, 30, 15);
        doc.text('Diamond Foods LLC', doc.internal.pageSize.width - 47, 20);
        doc.text('1050 Diamond St', doc.internal.pageSize.width - 47, 24);
        doc.text('Stockton, CA 95205', doc.internal.pageSize.width - 47, 28);
      }
    }
    doc.save(fileName);
  }
}
