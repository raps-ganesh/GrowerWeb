import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AdminService } from 'src/app/services/Admin/admin.service';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  pagenumber: number = 1;
  pagesize: number = 10;
  searchstring: string = '';
  pagecount: number = 0;
  sortcolumn: string = 'Id';
  sortdirection: string = 'ASC';
  totalrecords: number = 0;
  datacount: number = 0;
  pagingArray: any = [];



  userInfo: any;

  constructor(
     
    private adminService: AdminService,
    public appSettingService: AppSettingsService,
    private excelService: ExcelService
  ) { }

  ngOnInit(): void {
    this.getUsers(
      this.sortcolumn,
      this.sortdirection,
      this.searchstring,
      this.pagenumber,
      this.pagesize
    );
  }

  sort(sortby: string) {
    this.getUsers(
      sortby,
      this.sortdirection == 'DESC' ? 'ASC' : 'DESC',
      this.searchstring,
      this.pagenumber,
      this.pagesize
    );
  }

  paging(pagenumber: number) {
    this.getUsers(
      this.sortcolumn,
      this.sortdirection,
      this.searchstring,
      pagenumber,
      this.pagesize
    );
  }
  pageSizeChange(e: any) {
    this.getUsers(
      this.sortcolumn,
      this.sortdirection,
      this.searchstring,
      1,
      parseInt(e.target.value)
    );
  }



  getUsers(
    sortcolumn: string,
    sortdirection: string,
    searchstring: string,
    pagenumber: number,
    pagesize: number
  ) {
    this.adminService
      .getUsers({
        sortcolumn: sortcolumn,
        sortdirection: sortdirection,
        pagenumber: pagenumber,
        searchstring: searchstring,
        pagesize: pagesize,
      })
      .subscribe({
        next: (data: any) => {
          debugger;
          this.userInfo = data;
          this.pagecount =
            this.userInfo.length > 0
              ? this.userInfo[0].totalPages
              : 0;
          this.totalrecords =
            this.userInfo.length > 0
              ? this.userInfo[0].totalCount
              : 0;

          this.sortcolumn = sortcolumn;
          this.sortdirection = sortdirection;
          this.pagenumber = pagenumber;
          this.searchstring = searchstring;
          this.datacount = this.userInfo.length;

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

  editUser(
    id: any,
    tractorId: any,
    tractorOwner: any,
    tractorLicense: any
  ) {
    // this.cleanPopup();
    // this.tractorInformationId = id;
    // this.tractorId = tractorId;
    // this.tractorOwner = tractorOwner;
    // this.tractorLicense = tractorLicense;
    // this.modalConfig.modalTitle = 'Edit Tractor Information ';
    // this.modalConfig.size = 'lg';
    // this.modalConfig.dismissButtonLabel = 'Close';
    // setTimeout(() => {
    //   this.createTractorInfoComponent.ngOnInit();
    //   this.modalComponent.open();
    // }, 200);
  }

  deleteUser(id: any) {
    Swal.fire({
      text: 'Are you sure, you want to delete Tractor Information.?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        // this.tractorinformationService.deleteTractorInformation(id).subscribe({
        //   error: (e: any) => {
        //     Swal.fire({
        //       text: e.error,
        //       icon: 'error',
        //       buttonsStyling: false,
        //       confirmButtonText: 'Ok, got it!',
        //       customClass: {
        //         confirmButton: 'btn btn-primary',
        //       },
        //     });
        //   },
        //   complete: () => {
        //     Swal.fire({
        //       text: 'Tractor information deleted successfully.',
        //       icon: 'success',
        //       buttonsStyling: false,
        //       confirmButtonText: 'Ok, got it!',
        //       customClass: {
        //         confirmButton: 'btn btn-primary',
        //       },
        //     });
        //     this.ngOnInit();
        //   },
        // });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Tractor information not deleted.', 'error');
      }
    });
  }

  canDelete() {
    // return (
    //   new RoleGuard().canShow(['SEC_NPS_RCV_TRACTOR_DEL'])
    // );
    return true;
  }

}
