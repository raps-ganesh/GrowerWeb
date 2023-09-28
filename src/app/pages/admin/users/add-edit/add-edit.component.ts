import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/Admin/admin.service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs/operators';
import { Item } from 'angular2-multiselect-dropdown';
import { environment } from 'src/environments/environment';
import { GrowerPortalService } from 'src/app/services/Grower/grower-portal.service';
import { debug } from 'console';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {


  //private fb: FormBuilder,

  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  id: any;

  dropdownList: any = [];
  selectedItems: any = [];
  dropdownSettings: any = {};
  usermodel: UserModel = {
    id: 0,
    firstName: '',
    email: '',
    password: '',
    oldVendor_Id: '',
    accountType: '',
    accountNumber: '',
    isActive: false,
    accountIds: '',
    userTypeIds: '',
    userAccounts: []
  };
  @ViewChild('userForm') userForm: NgForm;


  cropYear: any;
  receivingLocation: any;
  UserAccountTypes: any;
  AuthTypes: any;
  UserGroups: any;
  paramsObject: any;
  showGrowerAccountDetails: any = false;
  showDehydratorAccountDetails: any = false;

  receipienttypeaheadUrl: string = environment.growerAccountingApiBaseUrl + 'ReceipientTypeAhead';
  accounttypeaheadUrl: string = environment.growerAccountingApiBaseUrl + 'AccountsTypeAhead';
  dehydratortypeaheadUrl: string = environment.reportsBaseUrl + 'DehydratorTypeAhead';

  @Input() receipient: string;
  @Input() receipient1: string;

  @Input() accountNumber: string;
  @Input() supplierId: any;


  @Input() dehyderatorId: string;
  @Input() dehyderatoraccount: string;
  populateSupplierInfo(event: any) {
    this.supplierId = event;
    console.log(this.supplierId);

  }
  populateAccountInfo(event: any) {
    this.accountNumber = event;
  }

  populateDehyderatorInfo(event: any) {
    this.dehyderatoraccount = event;
  }

  constructor(private cdr: ChangeDetectorRef, private adminService: AdminService, private route: ActivatedRoute
    , private growerPortalService: GrowerPortalService, private router: Router) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.id = this.route.snapshot.paramMap.get('id1');
  }
  ngOnInit(): void {

    this.selectedItems = [];
    //this.selectedItems = [{"id":1,"itemName":"Administrators"}];
    this.dropdownSettings = {
      singleSelection: false,
      text: "Select Group",
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      enableSearchFilter: true,
      classes: "form-control form-control-solid fs-4"
    };


    this.GetAccountTypes();
    this.GetAuthTypes();
    this.GetGroup();

    if (this.id > 0) {
      //alert("Edit User");
      this.usermodel.id = this.id
      this.GetUserById(this.usermodel.id);
    }
    else {
      this.usermodel.id = 0;
      this.usermodel.isActive = true;
      //alert("New User");
    }


    this.CheckPassword();

  }

  GetAccountTypes() {
    this.adminService.GetAccountTypes().subscribe({
      next: (data: any) => {
        //
        this.UserAccountTypes = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  GetAuthTypes() {
    this.adminService.GetAuthTypes().subscribe({
      next: (data: any) => {
        //
        this.AuthTypes = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  GetGroup() {
    this.adminService.GetGroup().subscribe({
      next: (data: any) => {
        //
        this.dropdownList = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  GetUserById(userId: any) {
    this.adminService.GetUserById(userId).subscribe({
      next: (data: any) => {

        debugger;
        this.usermodel = data;
        this.usermodel.confirmPassword = '';

        var itm = this.dropdownList;
        var dataToSend: any = [];
        var batches = this.usermodel.userGroups != null ? this.usermodel.userGroups.split(',') : [];
        batches?.forEach(function (element: any) {
          var it = itm.filter((x: any) => x.id == element);
          //alert(it.itemName);
          dataToSend.push({ "id": Number(element), "itemName": it[0].itemName });
        });

        this.selectedItems = dataToSend;
        //this.selectedItems = [{"id":1,"itemName":"Administrators"}];

        this.EnableDisableAccount();
        debugger;
        this.listAccounts = data.userAccounts;
        // data.userDetails.forEach((element: any) => {
        //   let index = this.listAccounts.indexOf(element.oldVendor_Id);
        //   if (index == -1)
        //     this.listAccounts.push(element.oldVendor_Id);
        // });
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  onItemSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);
    this.EnableDisableAccount();
  }
  OnItemDeSelect(item: any) {
    console.log(item);
    console.log(this.selectedItems);

    this.EnableDisableAccount();

  }
  onSelectAll(items: any) {
    console.log(items);

    this.EnableDisableAccount();
  }
  onDeSelectAll(items: any) {
    console.log(items);

    this.EnableDisableAccount();
  }
  EnableDisableAccount() {
    this.showDehydratorAccountDetails = this.selectedItems?.filter((x: any) => x.id === 4).length > 0;
    this.showGrowerAccountDetails = this.selectedItems?.filter((x: any) => x.id === 3).length > 0;
  }

  UserValidation() {
    if (this.usermodel.password != this.usermodel.confirmPassword) {
      Swal.fire({
        text: "Password and confirm password not matched.",
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });


      return false
    }
    return true;
  }
  saveSettings() {


    var ctrl = this.userForm.controls;
    if (!this.UserValidation())
      return;
    ////
    if (this.userForm.invalid) {
      Swal.fire('Invalide', 'Please fill in all the required fields.', 'error');
    } else {
      Swal.fire({
        title: 'Confirm User',
        text: 'Are you sure, you want to save user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          this.SaveUser();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'User not saved.', 'error');
        }
      });
    }

    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);



  }

  SaveUser() {
    debugger;
    var gropupIds = "";

    this.selectedItems?.forEach((element: any) => {
      if (gropupIds == "")
        gropupIds = "" + element.id
      else
        gropupIds = gropupIds + "," + element.id

    });
    this.usermodel.userGroups = gropupIds;
    var accountIds = '', userTypeIds = '';
    this.listAccounts?.forEach((element: any) => {
      accountIds = accountIds + element.key + ',';
      userTypeIds = userTypeIds + element.value + ','
    });
    this.usermodel.accountIds = accountIds.length > 0 ? accountIds.substring(0, accountIds.length - 1) : '';
    this.usermodel.userTypeIds = userTypeIds.length > 0 ? userTypeIds.substring(0, userTypeIds.length - 1) : '';
    this.adminService.SaveUser(this.usermodel).subscribe({
      next: (data: any) => {
        //
        var insertId = data;

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
        this.router.navigateByUrl('/users');
      },
      complete: () => {
        Swal.fire({
          text: 'User saved successfully.',
          icon: 'success',
          buttonsStyling: false,
          confirmButtonText: 'Ok, got it!',
          customClass: {
            confirmButton: 'btn btn-primary',
          },
        }).then(({ value }) => {
          this.router.navigate(['/users']);
        });


      }
    });
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }




  onSubmit(data: any) {
    ////
    if (this.userForm.invalid) {
      Swal.fire('Invalide', 'Please fill in all the required fields.', 'error');
    } else {
      Swal.fire({
        title: 'Confirm User',
        text: 'Are you sure, you want to save user?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          this.saveSettings();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'User not saved.', 'error');
        }
      });
    }
  }

  keyPressNumbers(event: any) {
    ////
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  listAccounts: any = [];
  jdeAccountList: any;

  AddSupplierAccounts() {
    debugger;
    this.growerPortalService.GetUserAccountbyJDE(this.supplierId).subscribe({
      next: (data: any) => {
        //
        this.jdeAccountList = data;
        if (data.length > 0) {
          data.forEach((itm: any) => {
            if (this.listAccounts == null || this.listAccounts?.length == 0 || this.listAccounts?.find((data: { key: any; }) => data.key === itm) == null || this.listAccounts?.find((data: { key: any; }) => data.key === itm) == undefined || this.listAccounts?.find((data: { key: any; }) => data.key === itm)?.length == 0) {
              this.listAccounts = this.listAccounts == null ? [] : this.listAccounts;
              this.listAccounts.push({ key: itm, value: 11, type: "Grower" });
              Swal.fire({
                text: "Account(s) Added",
                icon: 'success',
                buttonsStyling: false,
                confirmButtonText: 'Ok, got it!',
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
              });
            }
            else {
              Swal.fire({
                text: "Already added account number : " + itm,
                icon: 'error',
                buttonsStyling: false,
                confirmButtonText: 'Ok, got it!',
                customClass: {
                  confirmButton: 'btn btn-primary',
                },
              });

            }
          });
        }
        else {
          Swal.fire({
            text: "No Data Found",
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });

        }
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  AddAccountNumber() {
    this.accountNumber = (
      document.getElementById('AccountNumber') as HTMLInputElement
    ).value
    if (this.listAccounts == null || this.listAccounts?.length == 0 || this.listAccounts?.find((data: { key: any; }) => data.key === this.accountNumber) == undefined || this.listAccounts.find((data: { key: any; }) => data.key === this.accountNumber).length == 0) {
      this.listAccounts = this.listAccounts == null ? [] : this.listAccounts;
      this.listAccounts?.push({ key: this.accountNumber, value: 11, type: "Grower" });
      Swal.fire({
        text: "Account Added : " + this.accountNumber,
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      (
        document.getElementById('AccountNumber') as HTMLInputElement
      ).value = '';
    }
    else {
      Swal.fire({
        text: "Already added account number : " + this.accountNumber,
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
    }
  }

  AddDehyderator() {
    var accountNumber = (
      document.getElementById('dehyderatoraccount') as HTMLInputElement
    ).value;
    if (this.listAccounts == null || this.listAccounts.length == 0 || this.listAccounts.find((data: { key: any; }) => data.key === accountNumber.split('-')[0]) == undefined || this.listAccounts.find((data: { key: any; }) => data.key === accountNumber.split('-')[0]).length == 0) {

      if (this.listAccounts == null)
        this.listAccounts = [];
      this.listAccounts.push({ key: accountNumber.split('-')[0], value: 10, type: "Dehydrator" });
      Swal.fire({
        text: "Account Added : " + accountNumber,
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
      (
        document.getElementById('dehyderatoraccount') as HTMLInputElement
      ).value = '';
    }
    else {
      Swal.fire({
        text: "Already added account number : " + accountNumber,
        icon: 'error',
        buttonsStyling: false,
        confirmButtonText: 'Ok, got it!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      });
    }
  }
  removeJDENumber(item: any) {
    let index = this.listAccounts.indexOf(item);
    this.listAccounts.splice(index, 1);
  }

  CheckPassword() {
    //.setErrors({'incorrect': true});
    //this.userForm.controls['usermodel.password'].setValidators([Validators.required]);
    //this.userForm.controls['Password'].setErrors({'incorrect': true});
  }

  passwordError: any = '';
  ValidatePassword() {

    var isValid = true;
    //showPasswordValidation();
    this.passwordError = "";

    var password = this.usermodel.password;
    //console.log(password);

    if (password.length < 6) {
      isValid = false;
      this.setInValidState("At least 6 characters long");
    } else
      this.setValidState("password-length");

    console.log(password.match(/[0-9]/g));

    if (!password.match(/[0-9]/g)) {
      isValid = false;
      this.setInValidState("At least one number");
    } else
      this.setValidState("password-number");

    if (!password.match(/[A-Z]/g)) {
      isValid = false;
      this.setInValidState("At least one capital letter");
    } else
      this.setValidState("password-caps");


    if (!password.match(/[!@@#$%^&*()_=\[\]{};':"\\|,.<>\/?+-]/g)) {
      isValid = false;
      this.setInValidState("At least one special character");
    } else
      this.setValidState("password-special");

    return isValid;
  }

  setInValidState(msg: any) {
    this.passwordError = this.passwordError + "<br/>" + msg;
  }
  setValidState(msg: any) {

  }



}
