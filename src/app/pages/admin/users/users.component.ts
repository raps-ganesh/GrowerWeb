import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AdminService } from 'src/app/services/Admin/admin.service';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import { ModalComponent, ModalConfig } from 'src/app/_metronic/partials';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

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


  userid :any;
  userName:any;
  modalConfig: ModalConfig = {
    modalTitle: 'Reset Password',
    size: 'xl',
    hideCloseButton() {
      return true;
    },
  };
  @ViewChild('modal') public modalComponent: ModalComponent;
  @ViewChild(ResetPasswordComponent)
  private resetPasswordComponent: ResetPasswordComponent;
  closePopup() {
    this.ngOnInit();
    this.modalComponent.dismiss();
  }

  onKey(event: any) {
    this.getUsers(
      this.sortcolumn,
      this.sortdirection,
      event.target.value,
      1,
      this.pagesize
    );
  }

  passwordResend(userId: any,userName: any) {
  
    this.cleanPopup();
    this.userid = userId;
    this.userName=userName
    this.modalConfig.modalTitle = 'Reset User Password - '+userName;
    this.modalConfig.size = 'lg';
    this.modalConfig.dismissButtonLabel = '';
    
    setTimeout(() => {
      this.resetPasswordComponent.ngOnInit();
      this.modalComponent.open();
    }, 200);
  }
  cleanPopup() {
    this.userid = null;
    this.userName = null;
  }


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
          //debugger;
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
    debugger;
    Swal.fire({
      text: 'Are you sure, do you want to deactivate this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        this.adminService.DeleteUser(id).subscribe({
          next: (data: any) => {
            //debugger;
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
              text: 'User deleted successfully.',
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
        Swal.fire('Cancelled', 'User not deactivated', 'error');
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
