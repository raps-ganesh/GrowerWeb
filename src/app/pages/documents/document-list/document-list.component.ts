import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/services/Document/document.service';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.scss']
})
export class DocumentListComponent {




  pagenumber: number = 1;
  pagesize: number = 10;
  searchstring: string = '';
  pagecount: number = 0;
  sortcolumn: string = 'Id';
  sortdirection: string = 'ASC';
  totalrecords: number = 0;
  datacount: number = 0;
  pagingArray: any = [];

  DocType: string = '';
  DocTypeId: number = 0;
  DocTitle: string = '';
  documentInfo: any;

  constructor(

    private documentService: DocumentService,
    public appSettingService: AppSettingsService,
    private excelService: ExcelService,
    private router: Router,
  ) {

    this.DocType =
      this.router.url.split('/')[2] != null
        ? this.router.url.split('/')[2]
        : '';

    if (this.DocType == 'growers') {
      this.DocTitle = 'Food Safety';
      this.DocTypeId = 2;
    }
    else if (this.DocType == 'dehydrators') {
      this.DocTitle = 'News Letters';
      this.DocTypeId = 3;
    }
    else {
      this.DocTitle = '';
      this.DocTypeId = 0;
    }


  }

  ngOnInit(): void {
    this.GetDocuments(
      this.sortcolumn,
      this.sortdirection,
      this.searchstring,
      this.pagenumber,
      this.pagesize
    );
  }

  onKey(event: any) {
    this.GetDocuments(
      this.sortcolumn,
      this.sortdirection,
      event.target.value,
      1,
      this.pagesize
    );
  }

  sort(sortby: string) {
    this.GetDocuments(
      sortby,
      this.sortdirection == 'DESC' ? 'ASC' : 'DESC',
      this.searchstring,
      this.pagenumber,
      this.pagesize
    );
  }

  paging(pagenumber: number) {
    this.GetDocuments(
      this.sortcolumn,
      this.sortdirection,
      this.searchstring,
      pagenumber,
      this.pagesize
    );
  }
  pageSizeChange(e: any) {
    this.GetDocuments(
      this.sortcolumn,
      this.sortdirection,
      this.searchstring,
      1,
      parseInt(e.target.value)
    );
  }



  GetDocuments(
    sortcolumn: string,
    sortdirection: string,
    searchstring: string,
    pagenumber: number,
    pagesize: number
  ) {
    this.documentService
      .GetDocumentsByType({
        sortcolumn: sortcolumn,
        sortdirection: sortdirection,
        pagenumber: pagenumber,
        searchstring: searchstring,
        pagesize: pagesize,
        DocTypeId: this.DocTypeId
      })
      .subscribe({
        next: (data: any) => {
          //
          this.documentInfo = data;
          this.pagecount =
            this.documentInfo.length > 0
              ? this.documentInfo[0].totalPages
              : 0;
          this.totalrecords =
            this.documentInfo.length > 0
              ? this.documentInfo[0].totalCount
              : 0;

          this.sortcolumn = sortcolumn;
          this.sortdirection = sortdirection;
          this.pagenumber = pagenumber;
          this.searchstring = searchstring;
          this.datacount = this.documentInfo.length;

          this.pagesize = pagesize;
          this.pagingArray = this.appSettingService.paging(
            this.pagecount,
            this.pagenumber,
            this.totalrecords,
            this.pagesize
          );

          this.filterYear();
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  filterYear(): any[] {

    debugger;
    var a = this.documentInfo?.map((x: any) => x.modifiedYear);
    a = Array.from(new Set(this.documentInfo?.map((x: any) => x.modifiedYear).sort((a: any, b: any) => b - a)));
    return a;
  }

  filterFunction(filter: any): any[] {
    return this.documentInfo?.filter(
      (x: { modifiedYear: any }) => x.modifiedYear === filter
    );
  }

  public createImgPath = (serverPath: string) => {
    return environment.documentPath + `${serverPath}`;
  }
}
