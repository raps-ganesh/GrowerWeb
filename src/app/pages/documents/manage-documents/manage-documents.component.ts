import { Component, OnInit } from '@angular/core';
import { DocumentService } from 'src/app/services/Document/document.service';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import Swal from 'sweetalert2';
import {Safe} from 'src/app/models/Safe '
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-manage-documents',
  templateUrl: './manage-documents.component.html',
  styleUrls: ['./manage-documents.component.scss']
})
export class ManageDocumentsComponent implements OnInit {
 

  
  pagenumber: number = 1;
  pagesize: number = 10;
  searchstring: string = '';
  pagecount: number = 0;
  sortcolumn: string = 'Id';
  sortdirection: string = 'DESC';
  totalrecords: number = 0;
  datacount: number = 0;
  pagingArray: any = [];


  documentInfo: any;

  constructor(
     
    private documentService: DocumentService,
    public appSettingService: AppSettingsService,
    private excelService: ExcelService
  ) { }

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
      .GetDocuments({
        sortcolumn: sortcolumn,
        sortdirection: sortdirection,
        pagenumber: pagenumber,
        searchstring: searchstring,
        pagesize: pagesize,
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
        },
        error: (err: any) => {
          console.log(err);
        },
      });
  }

  deleteDocument(id: any) {
    
    Swal.fire({
      text: 'Are you sure, do you want to delete this document?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.documentService.DeleteDocument(id).subscribe({
          next: (data: any) => {
            //
            var insertId= data;
           
          },
          error: (err: any) => {
            console.log(err);
            Swal.fire({
              text: err.error.text,
              icon: 'error',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            });
    
          },
          complete:()=>{
            Swal.fire({
              text: 'Document deleted successfully.',
              icon: 'success',
              buttonsStyling: false,
              confirmButtonText: 'Ok, got it!',
              customClass: {
                confirmButton: 'btn btn-primary',
              },
            });
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Document not deleted', 'error');
      }
    });
  }

  canDelete() {
    // return (
    //   new RoleGuard().canShow(['SEC_NPS_RCV_TRACTOR_DEL'])
    // );
    return true;
  }

  public createImgPath = (serverPath: string) => { 
    return environment.imagePathUrl+`${serverPath}`; 
  }
  

}
