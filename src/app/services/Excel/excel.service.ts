// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ExcelServiceService {

//   constructor() { }
// }
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
// import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
// import { AuthHTTPService } from '../modules/auth/services/auth-http/fake/auth-fake-http.service';

const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  constructor(public authHttpService: AuthHTTPService) { }

  public exportAsExcelFile(
    reportHeading: string,
    reportSubHeading: string,
    headersArray: any[],
    json: any[],
    footerData: any,
    excelFileName: string,
    sheetName: string,
    SearchArray: any[] = [],
    mainHeadersArray: any[] = [],
    json2: any[] = [],
    sheetName2: string = '',
    mainHeadersArray2: any[] = [],
    headersArray2: any[] = [],
    aboveMainHeadersArray: any[] = [],
    additionalHeader: any[] = []

  ) {
    const header = headersArray;
    const header2 = headersArray2;
    const mainHeader = mainHeadersArray;
    const aboveMainHeader = aboveMainHeadersArray;
    const data = json;
    const searchdata = SearchArray;

    /* Create workbook and worksheet */
    const workbook = new Workbook();
    workbook.creator = 'Snippet Coder';
    workbook.lastModifiedBy = 'SnippetCoder';
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(sheetName);

    /*Add image row*/
    const imgBase64 = this.imageLogo();
    //Add Image
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    worksheet.mergeCells('F1:F3');
    worksheet.addImage(myLogoImage, 'F1:F3');
    worksheet.getColumn('F').width = 20;
    //
    /* Add Header Row */
    worksheet.addRow([]);
    //worksheet.mergeCells('A1:' + this.numToAlpha(header.length - 1) + '1');
    worksheet.getCell('A1').value = reportHeading;
    //worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 15, bold: true };

    if (reportSubHeading !== '') {
      worksheet.addRow([]);
      //worksheet.mergeCells('B2:' + this.numToAlpha(header.length - 1) + '2');
      worksheet.getCell('B1').value = reportSubHeading;
      //worksheet.getCell('B2').alignment = { horizontal: 'center' };
      worksheet.getCell('B1').font = { size: 12, bold: false };
    }

    worksheet.addRow([]);
    worksheet.getCell('F4').value = 'Diamond Foods LLC';
    worksheet.getCell('F5').value = '1050 Diamond St';
    worksheet.getCell('F6').value = 'Stockton, CA 95205';

    worksheet.getCell('F4').alignment = { horizontal: 'center' };
    worksheet.getCell('F5').alignment = { horizontal: 'center' };
    worksheet.getCell('F6').alignment = { horizontal: 'center' };

    // worksheet.addRow([]);
    // worksheet.addRow([]);

    worksheet.getCell('A3').value = 'Date and Time';
    worksheet.getCell('B3').value = formatDate(
      new Date(),
      'MM-dd-yyyy hh:mm:ss a',
      'en-US',
      '-0800'
    );
    worksheet.getCell('B3').alignment = { horizontal: 'left' };
    worksheet.getCell('A4').value = 'Run By';
    worksheet.getCell('B4').value = this.authHttpService.getLoggedInUserName();
    worksheet.getCell('B4').alignment = { horizontal: 'left' };

    if (additionalHeader.length > 0) {
      worksheet.mergeCells('A5:E5');
      worksheet.getCell('A5').value = additionalHeader[0];
      worksheet.getCell('A5').alignment = { horizontal: 'center' };
      worksheet.getCell('A5').font = { size: 11, bold: true }
      //worksheet.getColumn(1).width =additionalHeader[0].length;

      
    }
    if (SearchArray.length > 0) {
      worksheet.addRow([]);
      worksheet.getCell('A7').value = 'Report Parameters :';
    }

    /* Search Array */
    let columnsArray1: any[];
    for (const key in SearchArray) {
      if (json.hasOwnProperty(key)) {
        columnsArray1 = Object.keys(searchdata[key]);
      }
    }
    var ri = 7;
    SearchArray.forEach((element: any) => {
      //
      const eachRow: any = [];
      columnsArray1.forEach((column) => {
        eachRow.push(element[column]);
      });
      worksheet.addRow(eachRow).alignment = { horizontal: 'left' };
      worksheet.getCell('B' + ri++).font = { bold: true };
    });

    worksheet.addRow([]);

    /* Add Header Row */
    if (aboveMainHeadersArray.length > 0) {
      let headerRow2 = worksheet.addRow(aboveMainHeader);
      // Cell Style : Fill and Border
      headerRow2.eachCell((cell, index) => {
        //
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1faf9e' },
          bgColor: { argb: 'FFFFFFFF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: 'center' }
        worksheet.getColumn(index).width =
          header[index - 1].length < 20 ? 20 : header[index - 1].length;
      });
    }

    if (mainHeadersArray.length > 0) {
      let headerRow1 = worksheet.addRow(mainHeader);
      // Cell Style : Fill and Border
      headerRow1.eachCell((cell, index) => {
        //
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1faf9e' },
          bgColor: { argb: 'FFFFFFFF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: 'center' }
        worksheet.getColumn(index).width =
          header[index - 1].length < 20 ? 20 : header[index - 1].length;
      });
    }

    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
      worksheet.getColumn(index).width =
        header[index - 1].length < 20 ? 20 : header[index - 1].length;
    });

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }

    // Add Data and Conditional Formatting
    data.forEach((element: any) => {
      var isTotal = false;
      //var isNumberFormat = 0;
      const eachRow: any = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);
        if (element[column] == 'Total' || element[column] == 'Grand Total' || element[column] == 'Running Avg') {
          isTotal = true;
        }
        //console.log(column);        
      });

      if (element.isDeleted === 'Y') {
        const deletedRow = worksheet.addRow(eachRow);
        deletedRow.eachCell((cell) => {
          cell.font = {
            name: 'Calibri',
            family: 4,
            size: 11,
            bold: false,
            strike: true,
          };
        });
      } else if (isTotal) {
        const TotalRow = worksheet.addRow(eachRow);
        TotalRow.eachCell((cell) => {
          cell.font = { bold: true };
        });
      } else {
        const thisRow = worksheet.addRow(eachRow);
        // thisRow.eachCell((cell, index) => {
        //   if(index == 3)
        //     cell.numFmt = "0,000,000";
        // });
      }
      isTotal = false;
    });

    worksheet.addRow([]);

    /*Footer Data Row*/
    if (footerData != null) {
      footerData.forEach((element: any) => {
        const eachRow: any = [];
        element.forEach((val: any) => {
          eachRow.push(val);
        });

        const footerRow = worksheet.addRow(eachRow);
        footerRow.eachCell((cell) => {
          cell.font = { bold: true };
        });
      });
    }

    if (json2.length > 0) {
      this.CreateWorkesheet(
        workbook,
        sheetName2,
        header2,
        reportHeading,
        reportSubHeading,
        SearchArray,
        json2,
        searchdata,
        mainHeadersArray2,
        mainHeader,
        footerData,
        ''
      );
    }

    /*Save Excel File*/
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    });
  }

  private numToAlpha(num: number) {
    let alpha = '';

    for (; num >= 0; num = parseInt((num / 26).toString(), 10) - 1) {
      alpha = String.fromCharCode((num % 26) + 0x41) + alpha;
    }

    return alpha;
  }

  public CreateWorkesheet(
    workbook: any,
    sheetName: any,
    header: any,
    reportHeading: any,
    reportSubHeading: any,
    SearchArray: any,
    json: any,
    searchdata: any,
    mainHeadersArray: any,
    mainHeader: any,
    footerData: any,
    excelFileName: any
  ) {
    const data = json;
    const worksheet = workbook.addWorksheet(sheetName);
    /*Add image row*/
    const imgBase64 = this.imageLogo();
    //Add Image
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    // worksheet.mergeCells('A1:A3');
    // worksheet.addImage(myLogoImage, 'A1:A3');
    worksheet.mergeCells('F1:F3');
    worksheet.addImage(myLogoImage, 'F1:F3');
    worksheet.getColumn('F').width = 20;
    //
    /* Add Header Row */
    worksheet.addRow([]);
    //worksheet.mergeCells('B1:' + this.numToAlpha(header.length - 1) + '1');
    worksheet.getCell('A1').value = reportHeading;
    //worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 15, bold: true };

    if (reportSubHeading !== '') {
      worksheet.addRow([]);
      worksheet.mergeCells('B2:' + this.numToAlpha(header.length - 1) + '2');
      worksheet.getCell('B2').value = reportSubHeading;
      worksheet.getCell('B2').alignment = { horizontal: 'center' };
      worksheet.getCell('B2').font = { size: 12, bold: false };
    }

    worksheet.addRow([]);
    worksheet.getCell('F4').value = 'Diamond Foods LLC';
    worksheet.getCell('F5').value = '1050 Diamond St';
    worksheet.getCell('F6').value = 'Stockton, CA 95205';

    worksheet.getCell('F4').alignment = { horizontal: 'center' };
    worksheet.getCell('F5').alignment = { horizontal: 'center' };
    worksheet.getCell('F6').alignment = { horizontal: 'center' };

    worksheet.addRow([]);
    worksheet.addRow([]);

    /* Search Array */
    let columnsArray1: any[];
    for (const key in SearchArray) {
      if (json.hasOwnProperty(key)) {
        columnsArray1 = Object.keys(searchdata[key]);
      }
    }
    SearchArray.forEach((element: any) => {
      const eachRow: any = [];
      columnsArray1.forEach((column) => {
        eachRow.push(element[column]);
      });
      worksheet.addRow(eachRow);
    });
    worksheet.addRow([]);

    /* Add Header Row */
    if (mainHeadersArray.length > 0) {
      let headerRow1 = worksheet.addRow(mainHeader);
      // Cell Style : Fill and Border
      headerRow1.eachCell((cell: any, index: any) => {
        //
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1faf9e' },
          bgColor: { argb: 'FFFFFFFF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: 'center' }
        worksheet.getColumn(index).width =
          header[index - 1].length < 20 ? 20 : header[index - 1].length;
      });
    }

    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell: any, index: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
      worksheet.getColumn(index).width =
        header[index - 1].length < 20 ? 20 : header[index - 1].length;
    });

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }

    // Add Data and Conditional Formatting
    data.forEach((element: any) => {
      var isTotal = false;
      const eachRow: any = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);
        if (element[column] == 'Total' || element[column] == 'Grand Total') {
          isTotal = true;
        }
      });

      if (element.isDeleted === 'Y') {
        const deletedRow = worksheet.addRow(eachRow);
        deletedRow.eachCell((cell: any) => {
          cell.font = {
            name: 'Calibri',
            family: 4,
            size: 11,
            bold: false,
            strike: true,
          };
        });
      } else if (isTotal) {
        const TotalRow = worksheet.addRow(eachRow);
        TotalRow.eachCell((cell: any) => {
          cell.font = { size: 12, bold: true };
        });
      } else {
        worksheet.addRow(eachRow);
      }
      isTotal = false;
    });

    worksheet.addRow([]);

    /*Footer Data Row*/
    if (footerData != null) {
      footerData.forEach((element: any) => {
        const eachRow: any = [];
        element.forEach((val: any) => {
          eachRow.push(val);
        });

        const footerRow = worksheet.addRow(eachRow);
        footerRow.eachCell((cell: any) => {
          cell.font = { bold: true };
        });
      });
    }
  }

  public exportAsExcelFileGrowerQuality(
    reportHeading: string,
    reportSubHeading: string,
    headersArray: any[],
    json: any[],
    footerData: any,
    excelFileName: string,
    sheetName: string,
    SearchArray: any[] = [],
    mainHeadersArray: any[] = [],
    json2: any[] = [],
    sheetName2: string = '',
    cropyear : number,    
    mainHeadersArray2: any[] = [],
    
  ) {
    const header = headersArray;
    const mainHeader = mainHeadersArray;
    const data = json;
    const searchdata = SearchArray;

    /* Create workbook and worksheet */
    const workbook = new Workbook();
    workbook.creator = 'Snippet Coder';
    workbook.lastModifiedBy = 'SnippetCoder';
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(sheetName);

    /*Add image row*/
    const imgBase64 = this.imageLogo();
    //Add Image
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    //worksheet.mergeCells('F1:F3');
    worksheet.addImage(myLogoImage, 'F1:F3');
    worksheet.getColumn('F').width = 20;
    //
    /* Add Header Row */
    worksheet.addRow([]);
    //worksheet.mergeCells('A1:' + this.numToAlpha(header.length - 1) + '1');
    worksheet.getCell('A1').value = reportHeading;
    //worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 15, bold: true };

    if (reportSubHeading !== '') {
      worksheet.addRow([]);
      //worksheet.mergeCells('B2:' + this.numToAlpha(header.length - 1) + '2');
      worksheet.getCell('B1').value = reportSubHeading;
      //worksheet.getCell('B2').alignment = { horizontal: 'center' };
      worksheet.getCell('B1').font = { size: 12, bold: false };
    }

    worksheet.addRow([]);
    worksheet.getCell('F4').value = 'Diamond Foods LLC';
    worksheet.getCell('F5').value = '1050 Diamond St';
    worksheet.getCell('F6').value = 'Stockton, CA 95205';

    worksheet.getCell('F4').alignment = { horizontal: 'center' };
    worksheet.getCell('F5').alignment = { horizontal: 'center' };
    worksheet.getCell('F6').alignment = { horizontal: 'center' };

    // worksheet.addRow([]);
    // worksheet.addRow([]);

    worksheet.getCell('A3').value = 'Date and Time';
    worksheet.getCell('B3').value = formatDate(
      new Date(),
      'MM-dd-yyyy hh:mm:ss a',
      'en-US',
      '-0800'
    );
    worksheet.getCell('B3').alignment = { horizontal: 'left' };
    worksheet.getCell('A4').value = 'Run By';
    worksheet.getCell('B4').value = this.authHttpService.getLoggedInUserName();
    worksheet.getCell('B4').alignment = { horizontal: 'left' };

    if (SearchArray.length > 0) {
      worksheet.getCell('A6').value = 'Report Parameters :';
    }

    /* Search Array */
    let columnsArray1: any[];
    for (const key in SearchArray) {
      if (json.hasOwnProperty(key)) {
        columnsArray1 = Object.keys(searchdata[key]);
      }
    }
    var ri = 7;
    SearchArray.forEach((element: any) => {
      //
      const eachRow: any = [];
      columnsArray1.forEach((column) => {
        eachRow.push(element[column]);
      });
      worksheet.addRow(eachRow).alignment = { horizontal: 'left' };
      worksheet.getCell('B' + ri++).font = { bold: true };
    });

    worksheet.addRow([]);

    /* Add Header Row */
    if (mainHeadersArray.length > 0) {
      let headerRow1 = worksheet.addRow(mainHeader);
      // Cell Style : Fill and Border
      headerRow1.eachCell((cell, index) => {
        //
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1faf9e' },
          bgColor: { argb: 'FFFFFFFF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: 'center' }
        worksheet.getColumn(index).width =
          header[index - 1].length < 20 ? 20 : header[index - 1].length;
      });
    }

    // // Add Header
    // const headerRow = worksheet.addRow(header);

    // // Cell Style : Fill and Border
    // headerRow.eachCell((cell, index) => {
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: 'FF31b4a5' },
    //     bgColor: { argb: 'FF0000FF' },
    //   };
    //   cell.border = {
    //     top: { style: 'thin' },
    //     left: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     right: { style: 'thin' },
    //   };
    //   cell.font = { size: 12, bold: true };

    //   worksheet.getColumn(index).width =
    //     header[index - 1].length < 20 ? 20 : header[index - 1].length;
    // });

    // this.AddHeaders(worksheet,header);

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }
    //
    // Add Data and Conditional Formatting
    json2.forEach((element: any) => {
      const eachRow: any = [];
      eachRow.push('Name');
      eachRow.push(element['name']);
      eachRow.push('AccountNo');
      eachRow.push(element['accountNo']);

      const AccountNameRow = worksheet.addRow(eachRow);

      AccountNameRow.eachCell((cell, index) => {
        cell.font = { size: 12, bold: true };
      });

      // Add header
      this.AddHeaders(worksheet, header);
      let selected_count: number = 0;
      let totalNet_count: number = 0;
      var data1 = data.filter((x) => x.accountNo == element['accountNo']);
      selected_count = data1.length;
      data1.forEach((element: any) => {
        var isTotal = false;
        const eachRow: any = [];
        // columnsArray.forEach((column) => {
        //   eachRow.push(element[column]);
        //   if (element[column] == 'Total' || element[column] == 'Grand Total') {
        //     isTotal = true;
        //   }
        // });
        if (cropyear < 2022)
        {
        eachRow.push(element['ticketNumber']);
        eachRow.push(element['varietyName']);
        eachRow.push(element['receivingDate']);
        eachRow.push(element['gradingTicketType']);
        eachRow.push(element['netWeight']);
        eachRow.push(element['percentJumboSound']);
        eachRow.push(element['medbaby']);
        eachRow.push(element['percentEdibleYield']);
        eachRow.push(element['rli']);
        eachRow.push(element['percentInsect']);
        eachRow.push(element['percentBlowable']);
        eachRow.push(element['percentOffGrade']);
        eachRow.push(element['predominantOffgradeDamage']);
        eachRow.push(element['percentExternalDamage']);
        eachRow.push(element['predominantExternalDamage']);
        }
        else 
{
  eachRow.push(element['ticketNumber']);
  eachRow.push(element['varietyName']);
  eachRow.push(element['receivingDate']);
  eachRow.push(element['gradingTicketType']);
  eachRow.push(element['netWeight']);
  eachRow.push(element['percentJumboSound']);
  eachRow.push(element['medbaby']);
  eachRow.push(element['percentEdibleYield']);
  eachRow.push(element['percentExtraLightKernel']);
  eachRow.push(element['percentLightKernel']);
  eachRow.push(element['percentLightAmberKernel']);
  eachRow.push(element['percentAmberKernel']);
  eachRow.push(element['percentDarkKernel']);
  eachRow.push(element['percentInsect']);
  eachRow.push(element['percentBlowable']);
  eachRow.push(element['percentOffGrade']);
  eachRow.push(element['predominantOffgradeDamage']);
  eachRow.push(element['percentExternalDamage']);
  eachRow.push(element['predominantExternalDamage']);
}

        totalNet_count =
          parseInt(totalNet_count.toString()) +
          parseInt(element['netWeight'] == null ? '0' : element['netWeight']);

        worksheet.addRow(eachRow);
      });
      worksheet.addRow([selected_count, '', '', '', totalNet_count]).font = {
        bold: true,
      };

      worksheet.addRow([]);
      worksheet.addRow([]);
    });

    // data.forEach((element: any) => {
    //   var isTotal = false;
    //   const eachRow: any = [];
    //   columnsArray.forEach((column) => {
    //     eachRow.push(element[column]);
    //     if (element[column] == 'Total' || element[column] == 'Grand Total') {
    //       isTotal = true;
    //     }
    //   });
    //   worksheet.addRow(eachRow);
    // });

    //   if (element.isDeleted === 'Y') {
    //     const deletedRow = worksheet.addRow(eachRow);
    //     deletedRow.eachCell((cell) => {
    //       cell.font = {
    //         name: 'Calibri',
    //         family: 4,
    //         size: 11,
    //         bold: false,
    //         strike: true,
    //       };
    //     });
    //   } else if (isTotal) {
    //     const TotalRow = worksheet.addRow(eachRow);
    //     TotalRow.eachCell((cell) => {
    //       cell.font = { size: 12, bold: true };
    //     });
    //   } else {
    //     worksheet.addRow(eachRow);
    //   }
    //   isTotal = false;
    // });

    // worksheet.addRow([]);

    // /*Footer Data Row*/
    // if (footerData != null) {
    //   footerData.forEach((element: any) => {
    //     const eachRow: any = [];
    //     element.forEach((val: any) => {
    //       eachRow.push(val);
    //     });

    //     const footerRow = worksheet.addRow(eachRow);
    //     footerRow.eachCell((cell) => {
    //       cell.font = { bold: true };
    //     });
    //   });
    // }

    // if (json2.length > 0) {
    //   this.CreateWorkesheet(
    //     workbook,
    //     sheetName2,
    //     header,
    //     reportHeading,
    //     reportSubHeading,
    //     SearchArray,
    //     json2,
    //     searchdata,
    //     mainHeadersArray2,
    //     mainHeader,
    //     footerData,
    //     ''
    //   );
    // }

    /*Save Excel File*/
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    });
  }

  AddHeaders(worksheet: any, header: any) {
    // Add Header
    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell: any, index: any) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
      worksheet.getColumn(index).width =
        header[index - 1].length < 20 ? 20 : header[index - 1].length;
    });
  }


  public exportAsExcelFileDeliveryReport(
    reportHeading: string,
    reportSubHeading: string,
    headersArray: any[],
    json: any[],
    footerData: any,
    excelFileName: string,
    sheetName: string,
    SearchArray: any[] = [],
    mainHeadersArray: any[] = [],
    json2: any[] = [],
    sheetName2: string = '',
    mainHeadersArray2: any[] = [],
    json3: any[] = [],
    Json3Header: any[] = [],
    json4: any[] = [],
    json4Header: any[] = []
  ) {
    const header = headersArray;
    const mainHeader = mainHeadersArray;
    const data = json;
    const data3 = json3;
    const data4 = json4;
    const header4 = json4Header
    const searchdata = SearchArray;

    /* Create workbook and worksheet */
    const workbook = new Workbook();
    workbook.creator = 'Snippet Coder';
    workbook.lastModifiedBy = 'SnippetCoder';
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(sheetName);

    /*Add image row*/
    const imgBase64 = this.imageLogo();
    //Add Image
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    worksheet.mergeCells('F1:F3');
    worksheet.addImage(myLogoImage, 'F1:F3');
    worksheet.getColumn('F').width = 20;
    //
    /* Add Header Row */
    worksheet.addRow([]);
    //worksheet.mergeCells('A1:' + this.numToAlpha(header.length - 1) + '1');
    worksheet.getCell('A1').value = reportHeading;
    //worksheet.getCell('A1').alignment = { horizontal: 'center' };
    worksheet.getCell('A1').font = { size: 15, bold: true };

    if (reportSubHeading !== '') {
      worksheet.addRow([]);
      //worksheet.mergeCells('B2:' + this.numToAlpha(header.length - 1) + '2');
      worksheet.getCell('B1').value = reportSubHeading;
      //worksheet.getCell('B2').alignment = { horizontal: 'center' };
      worksheet.getCell('B1').font = { size: 12, bold: false };
    }

    worksheet.addRow([]);
    worksheet.getCell('F4').value = 'Diamond Foods LLC';
    worksheet.getCell('F5').value = '1050 Diamond St';
    worksheet.getCell('F6').value = 'Stockton, CA 95205';

    worksheet.getCell('F4').alignment = { horizontal: 'center' };
    worksheet.getCell('F5').alignment = { horizontal: 'center' };
    worksheet.getCell('F6').alignment = { horizontal: 'center' };

    // worksheet.addRow([]);
    // worksheet.addRow([]);

    worksheet.getCell('A3').value = 'Date and Time';
    worksheet.getCell('B3').value = formatDate(
      new Date(),
      'MM-dd-yyyy hh:mm:ss a',
      'en-US',
      '-0800'
    );
    worksheet.getCell('B3').alignment = { horizontal: 'left' };
    worksheet.getCell('A4').value = 'Run By';
    worksheet.getCell('B4').value = this.authHttpService.getLoggedInUserName();
    worksheet.getCell('B4').alignment = { horizontal: 'left' };

    if (SearchArray.length > 0) {
      worksheet.getCell('A6').value = 'Report Parameters :';
    }

    /* Search Array */
    let columnsArray1: any[];
    for (const key in SearchArray) {
      if (json.hasOwnProperty(key)) {
        columnsArray1 = Object.keys(searchdata[key]);
      }
    }
    var ri = 7;
    SearchArray.forEach((element: any) => {
      //
      const eachRow: any = [];
      columnsArray1.forEach((column) => {
        eachRow.push(element[column]);
      });
      worksheet.addRow(eachRow).alignment = { horizontal: 'left' };
      worksheet.getCell('B' + ri++).font = { bold: true };
    });

    worksheet.addRow([]);

    /* Add Header Row - aboveHeader */
    if (mainHeadersArray.length > 0) {
      let headerRow1 = worksheet.addRow(mainHeader);
      // Cell Style : Fill and Border
      headerRow1.eachCell((cell, index) => {
        //
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1faf9e' },
          bgColor: { argb: 'FFFFFFFF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: 'center' }
        worksheet.getColumn(index).width =
          header[index - 1].length < 20 ? 20 : header[index - 1].length;
      });
    }

    const headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
      worksheet.getColumn(index).width =
        header[index - 1].length < 15 ? 15 : header[index - 1].length;
    });

    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }

    // Add Data and Conditional Formatting
    data.forEach((element: any) => {
      var isTotal = false;
      const eachRow: any = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);
        if (element[column] == 'Variety Total' || element[column] == 'Account Total' || element[column] == 'Total' || element[column] == 'Grand Total') {
          isTotal = true;
        }
      });

      if (element.isDeleted === 'Y') {
        const deletedRow = worksheet.addRow(eachRow);
        deletedRow.eachCell((cell) => {
          cell.font = {
            name: 'Calibri',
            family: 4,
            size: 11,
            bold: false,
            strike: true,
          };
        });
      } else if (isTotal) {
        const TotalRow = worksheet.addRow(eachRow);
        TotalRow.eachCell((cell) => {
          cell.font = { bold: true };
        });
        worksheet.addRow([]);
      } else {
        worksheet.addRow(eachRow);
      }
      isTotal = false;
    });

    worksheet.addRow([]);
    // worksheet.addRow([]);


    let headerRow3 = worksheet.addRow(Json3Header);
    headerRow3.eachCell((cell) => {
      cell.font = { bold: true };
      cell.alignment = { horizontal: 'center' };
    });
    //
    // Add Data and Conditional Formatting

    let columnsArray3: any[];
    for (const key in json3) {
      if (json.hasOwnProperty(key)) {
        columnsArray3 = Object.keys(json3[key]);
      }
    }
    data3.forEach((element: any) => {
      //
      var isTotal = false;
      const eachRow: any = [];
      columnsArray3.forEach((column) => {
        eachRow.push(element[column]);

      });
      const TotalRow = worksheet.addRow(eachRow);
      TotalRow.eachCell((cell) => {
        cell.font = { bold: true };
      });
    });

    data4.forEach((element: any) => {
      var isTotal = false;
      const eachRow: any = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);

      });
      worksheet.addRow(eachRow);

    });




    worksheet.addRow([]);

    /*Footer Data Row*/
    if (footerData != null) {
      footerData.forEach((element: any) => {
        const eachRow: any = [];
        element.forEach((val: any) => {
          eachRow.push(val);
        });

        const footerRow = worksheet.addRow(eachRow);
        footerRow.eachCell((cell) => {
          cell.font = { bold: true };
        });
      });
    }

    if (json2.length > 0) {
      this.CreateWorkesheet(
        workbook,
        sheetName2,
        header,
        reportHeading,
        reportSubHeading,
        SearchArray,
        json2,
        searchdata,
        mainHeadersArray2,
        mainHeader,
        footerData,
        ''
      );
    }

    /*Save Excel File*/
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    });
  }



  //Daily Receiving Summary
  public exportAsExcelFileDailyReceivingSummary(
    reportHeading: string,
    reportSubHeading: string,
    headersArray: any[],
    json: any[],
    footerData: any,
    excelFileName: string,
    sheetName: string,

    SearchArray: any[] = [],
    mainHeadersArray: any[] = [],
    json2: any[] = [],
    sheetName2: string = '',

    mainHeadersArray2: any[] = [],
    json3: any[] = [],
    Json3Header: any[] = [],

    json4: any[] = [],
    json4Header: any[] = []




  ) {
    const header = headersArray;
    const mainHeader = mainHeadersArray;
    const data = json;
    const searchdata = SearchArray;


    const data3 = json3;
    const data4 = json4;
    const header4 = json4Header


    /* Create workbook and worksheet */
    const workbook = new Workbook();
    workbook.creator = 'Snippet Coder';
    workbook.lastModifiedBy = 'SnippetCoder';
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(sheetName);

    /*Fix Data*/
    /*Add image row*/
    const imgBase64 = this.imageLogo();
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    worksheet.addImage(myLogoImage, 'F1:F3');
    worksheet.getColumn('F').width = 20;
    worksheet.addRow([]);
    worksheet.getCell('A1').value = reportHeading;
    worksheet.getCell('A1').font = { size: 15, bold: true };

    if (reportSubHeading !== '') {
      worksheet.addRow([]);
      worksheet.getCell('B1').value = reportSubHeading;
      worksheet.getCell('B1').font = { size: 12, bold: false };
    }

    worksheet.addRow([]);
    worksheet.getCell('F4').value = 'Diamond Foods LLC';
    worksheet.getCell('F5').value = '1050 Diamond St';
    worksheet.getCell('F6').value = 'Stockton, CA 95205';

    worksheet.getCell('F4').alignment = { horizontal: 'center' };
    worksheet.getCell('F5').alignment = { horizontal: 'center' };
    worksheet.getCell('F6').alignment = { horizontal: 'center' };

    worksheet.getCell('A3').value = 'Date and Time';
    worksheet.getCell('B3').value = formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800');
    worksheet.getCell('B3').alignment = { horizontal: 'left' };
    worksheet.getCell('A4').value = 'Run By';
    worksheet.getCell('B4').value = this.authHttpService.getLoggedInUserName();
    worksheet.getCell('B4').alignment = { horizontal: 'left' };

    /*End Fix Data*/



    /* Search Array */
    if (SearchArray.length > 0) {
      worksheet.getCell('A6').value = 'Report Parameters :';
    }
    let columnsArray1: any[];
    for (const key in SearchArray) {
      if (json.hasOwnProperty(key)) {
        columnsArray1 = Object.keys(searchdata[key]);
      }
    }
    var ri = 7;
    SearchArray.forEach((element: any) => {
      //
      const eachRow: any = [];
      columnsArray1.forEach((column) => {
        eachRow.push(element[column]);
      });
      worksheet.addRow(eachRow).alignment = { horizontal: 'left' };
      worksheet.getCell('B' + ri++).font = { bold: true };
    });

    worksheet.addRow([]);

    /*End Search Array */



    /* Add Header Row - aboveHeader */
    if (mainHeadersArray.length > 0) {
      let headerRow1 = worksheet.addRow(mainHeader);
      // Cell Style : Fill and Border
      headerRow1.eachCell((cell, index) => {
        //
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1faf9e' },
          bgColor: { argb: 'FFFFFFFF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: 'center' }
        worksheet.getColumn(index).width =
          header[index - 1].length < 20 ? 20 : header[index - 1].length;
      });
    }


    /*Added Heading */
    const HeaerText: any = [];
    HeaerText.push('Daily Receipts vs. History');
    const AccountNameRow = worksheet.addRow(HeaerText);

    AccountNameRow.eachCell((cell, index) => {
      cell.font = { size: 12, bold: true };
    });

    const RowHeader: any = [];
    header.forEach((rec) => {
      RowHeader.push(rec.replace('@cropYear', '2022').replace('@preCropYear', '2021').replace('_yr', '').replace('sDay', 'Receiving Date').replace('Year1', '2022').replace('Year2', '2021'));
    });
    const headerRow = worksheet.addRow(RowHeader);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
      worksheet.getColumn(index).width =
        header[index - 1].length < 15 ? 15 : header[index - 1].length;
    });

    /*End Added Heading */




    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }

    // Add Data and Conditional Formatting
    data.forEach((element: any) => {
      var isTotal = false;
      const eachRow: any = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);
        if (element[column] == 'Variety Total' || element[column] == 'Account Total') {
          isTotal = true;
        }
      });

      if (element.isDeleted === 'Y') {
        const deletedRow = worksheet.addRow(eachRow);
        deletedRow.eachCell((cell) => {
          cell.font = {
            name: 'Calibri',
            family: 4,
            size: 11,
            bold: false,
            strike: true,
          };
        });
      } else if (isTotal) {
        const TotalRow = worksheet.addRow(eachRow);
        TotalRow.eachCell((cell) => {
          cell.font = { bold: true };
        });
        worksheet.addRow([]);
      } else {
        worksheet.addRow(eachRow);
      }
      isTotal = false;
    });

    worksheet.addRow([]);
    // worksheet.addRow([]);



    const HeaerText3: any = [];
    HeaerText3.push('Summary of Walnut Pounds by Receiving Date');
    const AccountNameRow3 = worksheet.addRow(HeaerText3);
    worksheet.addRow(['Crop Years 2021 v. 2022']);

    AccountNameRow3.eachCell((cell, index) => {


      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    });


    const json3RowHeader: any = [];
    Json3Header.forEach((rec) => {
      json3RowHeader.push(rec.replace('@cropYear', '2022').replace('@preCropYear', '2021').replace('_yr', '').replace('sDay', 'Receiving Date').replace('Year1', '2022').replace('Year2', '2021'));
    });
    let headerRow3 = worksheet.addRow(json3RowHeader);
    headerRow3.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    });
    //
    // Add Data and Conditional Formatting

    let columnsArray3: any[];
    for (const key in json3) {
      if (json.hasOwnProperty(key)) {
        columnsArray3 = Object.keys(json3[key]);
      }
    }
    data3.forEach((element: any) => {
      //
      var isTotal = false;
      const eachRow: any = [];
      columnsArray3.forEach((column) => {
        eachRow.push(element[column]);

      });
      const TotalRow = worksheet.addRow(eachRow);
      TotalRow.eachCell((cell) => {
        cell.font = { bold: true };
      });
    });

    worksheet.addRow([]);


    //
    const json4RowHeader: any = [];
    json4Header.forEach((rec) => {
      json4RowHeader.push(rec.replace('@cropYear', '2022').replace('@preCropYear', '2021').replace('_yr', '').replace('sDay', 'Receiving Date').replace('Year1', '2022').replace('Year2', '2021'));
    });

    let headerRow4 = worksheet.addRow(json4RowHeader);
    headerRow4.eachCell((cell) => {
      //
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }

    });

    let columnsArray4: any[];
    for (const key in json4) {
      if (json.hasOwnProperty(key)) {
        columnsArray4 = Object.keys(json4[key]);
      }
    }
    data4.forEach((element: any) => {
      var isTotal = false;
      const eachRow: any = [];
      columnsArray4.forEach((column) => {
        eachRow.push(element[column]);

      });
      worksheet.addRow(eachRow);

    });




    worksheet.addRow([]);



    /*Footer Data Row*/
    if (footerData != null) {
      footerData.forEach((element: any) => {
        const eachRow: any = [];
        element.forEach((val: any) => {
          eachRow.push(val);
        });

        const footerRow = worksheet.addRow(eachRow);
        footerRow.eachCell((cell) => {
          cell.font = { bold: true };
        });
      });
    }



    /*Save Excel File*/
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    });
  }


  //GrowerInspectionDailySummary
  public exportAsExcelFileGrowerInspectionDailySummary(
    reportHeading: string,
    reportSubHeading: string,
    headersArray: any[],
    json: any[],
    footerData: any,
    excelFileName: string,
    sheetName: string,

    SearchArray: any[] = [],
    mainHeadersArray: any[] = [],
    json2: any[] = [],
    sheetName2: string = '',

    mainHeadersArray2: any[] = [],
    json3: any[] = [],
    Json3Header: any[] = [],

    json4: any[] = [],
    json4Header: any[] = []




  ) {
    //
    const header = headersArray;
    const mainHeader = mainHeadersArray;
    const mainHeader2 = mainHeadersArray2;
    const data = json;
    const searchdata = SearchArray;


    const data3 = json3;
    const data4 = json4;
    const header4 = json4Header


    /* Create workbook and worksheet */
    const workbook = new Workbook();
    workbook.creator = 'Snippet Coder';
    workbook.lastModifiedBy = 'SnippetCoder';
    workbook.created = new Date();
    workbook.modified = new Date();
    const worksheet = workbook.addWorksheet(sheetName);

    /*Fix Data*/
    /*Add image row*/
    const imgBase64 = this.imageLogo();
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    worksheet.addImage(myLogoImage, 'F1:F3');
    worksheet.getColumn('F').width = 20;
    worksheet.addRow([]);
    worksheet.getCell('A1').value = reportHeading;
    worksheet.getCell('A1').font = { size: 15, bold: true };

    if (reportSubHeading !== '') {
      worksheet.addRow([]);
      worksheet.getCell('B1').value = reportSubHeading;
      worksheet.getCell('B1').font = { size: 12, bold: false };
    }

    worksheet.addRow([]);
    worksheet.getCell('F4').value = 'Diamond Foods LLC';
    worksheet.getCell('F5').value = '1050 Diamond St';
    worksheet.getCell('F6').value = 'Stockton, CA 95205';

    worksheet.getCell('F4').alignment = { horizontal: 'center' };
    worksheet.getCell('F5').alignment = { horizontal: 'center' };
    worksheet.getCell('F6').alignment = { horizontal: 'center' };

    worksheet.getCell('A3').value = 'Date and Time';
    worksheet.getCell('B3').value = formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss a', 'en-US', '-0800');
    worksheet.getCell('B3').alignment = { horizontal: 'left' };
    worksheet.getCell('A4').value = 'Run By';
    worksheet.getCell('B4').value = this.authHttpService.getLoggedInUserName();
    worksheet.getCell('B4').alignment = { horizontal: 'left' };

    /*End Fix Data*/



    /* Search Array */
    if (SearchArray.length > 0) {
      worksheet.getCell('A6').value = 'Report Parameters :';
    }
    let columnsArray1: any[];
    for (const key in SearchArray) {
      if (json.hasOwnProperty(key)) {
        columnsArray1 = Object.keys(searchdata[key]);
      }
    }
    var ri = 7;
    SearchArray.forEach((element: any) => {
      //
      const eachRow: any = [];
      columnsArray1.forEach((column) => {
        eachRow.push(element[column]);
      });
      worksheet.addRow(eachRow).alignment = { horizontal: 'left' };
      worksheet.getCell('B' + ri++).font = { bold: true };
    });

    worksheet.addRow([]);

    /*End Search Array */



    /* Add Header Row - aboveHeader */
    if (mainHeadersArray.length > 0) {
      let headerRow1 = worksheet.addRow(mainHeader);
      // Cell Style : Fill and Border
      headerRow1.eachCell((cell, index) => {
        //
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1faf9e' },
          bgColor: { argb: 'FFFFFFFF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: 'center' }
        worksheet.getColumn(index).width =
          header[index - 1].length < 20 ? 20 : header[index - 1].length;
      });
    }


    /*Added Heading */
    // const HeaerText: any = [];
    // HeaerText.push('Daily Receipts vs. History');
    // const AccountNameRow = worksheet.addRow(HeaerText);

    // AccountNameRow.eachCell((cell, index) => {
    //   cell.font = { size: 12, bold: true };
    // });

    const RowHeader: any = [];
    header.forEach((rec) => {
      RowHeader.push(rec.replace('@cropYear', '2022').replace('@preCropYear', '2021').replace('_yr', '').replace('sDay', 'Receiving Date').replace('Year1', '2022').replace('Year2', '2021'));
    });
    const headerRow = worksheet.addRow(RowHeader);
    // Cell Style : Fill and Border
    headerRow.eachCell((cell, index) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
      worksheet.getColumn(index).width =
        header[index - 1].length < 15 ? 15 : header[index - 1].length;
    });

    /*End Added Heading */




    // Get all columns from JSON
    let columnsArray: any[];
    for (const key in json) {
      if (json.hasOwnProperty(key)) {
        columnsArray = Object.keys(json[key]);
      }
    }

    // Add Data and Conditional Formatting
    data.forEach((element: any) => {
      var isTotal = false;
      const eachRow: any = [];
      columnsArray.forEach((column) => {
        eachRow.push(element[column]);
        if (element[column] == 'Variety Total' || element[column] == 'Account Total') {
          isTotal = true;
        }
      });

      if (element.isDeleted === 'Y') {
        const deletedRow = worksheet.addRow(eachRow);
        deletedRow.eachCell((cell) => {
          cell.font = {
            name: 'Calibri',
            family: 4,
            size: 11,
            bold: false,
            strike: true,
          };
        });
      } else if (isTotal) {
        const TotalRow = worksheet.addRow(eachRow);
        TotalRow.eachCell((cell) => {
          cell.font = { bold: true };
        });
        worksheet.addRow([]);
      } else {
        worksheet.addRow(eachRow);
      }
      isTotal = false;
    });

    worksheet.addRow([]);
    // worksheet.addRow([]);



    const HeaerText3: any = [];
    HeaerText3.push('Summary of Walnut Pounds - Received v. Graded');
    const AccountNameRow3 = worksheet.addRow(HeaerText3);

    // let titleRow = worksheet.addRow([]); 
    // let currentRow = titleRow._number; // merge by start row, start column, end row, end column 
    // worksheet.mergeCells(currentRow,1,currentRow,12); 
    // let titleCell = worksheet.getCell('A'+currentRow); titleCell.value = "title_text";


    worksheet.addRow(['Crop Years 2022']);

    AccountNameRow3.eachCell((cell, index) => {
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    });


    const json3RowHeader: any = [];
    Json3Header.forEach((rec) => {
      json3RowHeader.push(rec.replace('@cropYear', '2022').replace('@preCropYear', '2021').replace('_yr', '').replace('sDay', 'Receiving Date').replace('Year1', '2022').replace('Year2', '2021'));
    });
    let headerRow3 = worksheet.addRow(json3RowHeader);
    headerRow3.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }
    });
    //

    if (mainHeadersArray2.length > 0) {
      let headerRow2 = worksheet.addRow(mainHeader2);
      // Cell Style : Fill and Border
      headerRow2.eachCell((cell, index) => {
        //
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF1faf9e' },
          bgColor: { argb: 'FFFFFFFF' },
        };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 12, bold: true };
        cell.alignment = { horizontal: 'center' }

        worksheet.getColumn(index).width =
          mainHeader2[index - 1].length < 20 ? 20 : mainHeader2[index - 1].length;
      });
    }





    // Add Data and Conditional Formatting

    let columnsArray3: any[];
    for (const key in json3) {
      if (json.hasOwnProperty(key)) {
        columnsArray3 = Object.keys(json3[key]);
      }
    }
    data3.forEach((element: any) => {
      //
      var isTotal = false;
      const eachRow: any = [];
      columnsArray3.forEach((column) => {
        eachRow.push(element[column]);

      });
      const TotalRow = worksheet.addRow(eachRow);
      TotalRow.eachCell((cell) => {
        cell.font = { bold: true };
      });
    });

    //worksheet.addRow([]);


    //
    const json4RowHeader: any = [];
    json4Header.forEach((rec) => {
      json4RowHeader.push(rec.replace('@cropYear', '2022').replace('@preCropYear', '2021').replace('_yr', '').replace('sDay', 'Receiving Date').replace('Year1', '2022').replace('Year2', '2021'));
    });

    let headerRow4 = worksheet.addRow(json4RowHeader);
    headerRow4.eachCell((cell) => {
      //
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF31b4a5' },
        bgColor: { argb: 'FF0000FF' },
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = { size: 12, bold: true };
      cell.alignment = { horizontal: 'center' }

    });

    let columnsArray4: any[];
    for (const key in json4) {
      if (json.hasOwnProperty(key)) {
        columnsArray4 = Object.keys(json4[key]);
      }
    }
    data4.forEach((element: any) => {
      var isTotal = false;
      const eachRow: any = [];
      columnsArray4.forEach((column) => {
        eachRow.push(element[column]);

      });
      worksheet.addRow(eachRow);

    });




    worksheet.addRow([]);



    /*Footer Data Row*/
    if (footerData != null) {
      footerData.forEach((element: any) => {
        const eachRow: any = [];
        element.forEach((val: any) => {
          eachRow.push(val);
        });

        const footerRow = worksheet.addRow(eachRow);
        footerRow.eachCell((cell) => {
          cell.font = { bold: true };
        });
      });
    }



    /*Save Excel File*/
    workbook.xlsx.writeBuffer().then((data: ArrayBuffer) => {
      const blob = new Blob([data], { type: EXCEL_TYPE });
      fs.saveAs(blob, excelFileName + EXCEL_EXTENSION);
    });
  }




  imageLogo() {
    const imgBase64 =
      'data:image/png;base64,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';
    return imgBase64;
  }

}
