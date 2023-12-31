import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { UserModel } from '../../models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  defaultAuth: any = {
    email: '',
    password: '',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  showOTP: boolean = false;
  isMFAConfigured: boolean = true;
  OTPError: any = "";
  user: any;
  otp: any;
  authType: any = 1;
  phone: any;
  userName: any;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    debugger;
    this.hasError = false;
    this.authService.preLogin(this.f.email.value, this.f.password.value).subscribe({
      next: (result: any) => {
        if (result == null) {
          this.hasError = true;
          return;
        }
        debugger;
        this.user = result;
        if (result == undefined || result == null) {
          this.hasError = true;
          return;
        }
        if (result.authenticationType > 0 && result.isMFAConfigured) {
          this.showOTP = true;
        }
        else {
          this.isMFAConfigured = false;
        }
      }
    });
  }


  cancelOTP() {
    this.showOTP = false;
  }

  cancelMFA() {
    this.isMFAConfigured = true;
  }
  VerifyOTP() {
    debugger;
    var otp: any = document.getElementById('otp');
    this.authService.VerifyOTP(this.f.email.value, this.user.authenticationType, this.user.phoneNumber, otp.value).subscribe({
      next: (data: any) => {
        debugger;
        var insertId = data;
        if (data.value == 'Invalid OTP') {
          this.OTPError = 'Invalid One Time Password';
          Swal.fire({
            text: this.OTPError,
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        }
        else {
          Swal.fire({
            text: 'One Time Password validated successfully.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          }).then(({ value }) => {
            const loginSubscr = this.authService
              .login(this.f.email.value, this.f.password.value)
              .pipe(first())
              .subscribe((user: UserModel | undefined) => {
                if (user) {
                  this.router.navigate([this.returnUrl]);

                } else {
                  this.hasError = true;
                }
              });
            this.unsubscribe.push(loginSubscr);
          });


        }



      },
      error: (err: any) => {
        debugger;
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
      complete: () => {

      }
    });
  }

  setAuthType(type: any) {
    this.authType = type;
    if (type == 2) {
      (document.getElementById('phone') as HTMLInputElement).value = '';
    }

  }
  SetMFA() {
    this.phone = (document.getElementById('phone') as HTMLInputElement).value;
    if (this.authType == 2)
      if (this.phone == '' || this.phone.length > 10 || this.phone.length < 10 || isNaN(this.phone)) {
        Swal.fire({
          text: 'Please enter valid Phone number',
          icon: 'error',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        });
        return;
      }
    this.authService.MarkAsMFAConfigured({ Email: this.f.email.value, PhoneNumber: this.phone, AuthenticationType: this.authType }).subscribe({
      next: (data: any) => {
        this.authService.SendOTP({ Email: this.f.email.value, Phone: this.phone, AuthenticationType: this.authType, UserName: this.user.userName }).subscribe({
          next: (data: any) => {
            this.showOTP = true;
            this.isMFAConfigured = true;
          },
          error: (err: any) => {
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
          complete: () => {

          }
        });
      },
      error: (err: any) => {
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
      complete: () => {

      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
