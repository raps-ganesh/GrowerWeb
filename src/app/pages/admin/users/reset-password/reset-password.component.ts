import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AdminService } from 'src/app/services/Admin/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit{

  @Input() UserId: any;
  @Input() UserName: any;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  password:any;
  confirmPassword:any;

  ngOnInit(): void {
    // if (this.tractorOwners == undefined)
    //   this.tractorinformationService.getTractorOwner().subscribe({
    //     next: (data: any) => {
    //       this.tractorOwners = data;
    //     },
    //   });
  }

  constructor(private cdr: ChangeDetectorRef,private adminService: AdminService) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    
  }

  @ViewChild('resetForm') resetForm: NgForm;

  SendPassword()
  {

    if (this.resetForm.invalid) {
      Swal.fire('Invalide', 'Please fill in all the required fields.', 'error');
    } else {
      Swal.fire({
        title: 'Confirm Reset',
        text: 'Are you sure, you want to reset password?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          this.SetPassword();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Password not updated.', 'error');
        }
      });
    }



    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  SetPassword(){
    this.adminService.ResetPassword(this.UserId,this.password).subscribe({
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
          text: 'Password reset successfully.',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
      }
    });
  }

}
