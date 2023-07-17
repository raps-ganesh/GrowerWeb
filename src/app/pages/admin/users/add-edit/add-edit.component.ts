import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserModel } from 'src/app/models/user.model';
import { AdminService } from 'src/app/services/Admin/admin.service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs/operators';
import { Item } from 'angular2-multiselect-dropdown';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  


 
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  id: any;

  title = "geeksforgeeks-multiSelect";
  
  cars = [
    { id: 1, name: "BMW Hyundai" },
    { id: 2, name: "Kia Tata" },
    { id: 3, name: "Volkswagen Ford" },
    { id: 4, name: "Renault Audi" },
    { id: 5, name: "Mercedes Benz Skoda" },
  ];
  
  selected = [{ id: 3, name: "Volkswagen Ford" }];

  dropdownList :any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};
  usermodel : UserModel={
    id: 0,
    firstName: '',
    email: '',
    password: '',
    oldVendor_Id: '',
    accountType: '',
    accountNumber: '',
    isActive: false
  };
 @ViewChild('userForm') userForm: NgForm;


  cropYear:any;
  receivingLocation:any;
  UserAccountTypes:any;
  UserGroups:any;
  paramsObject:any;
  constructor(private cdr: ChangeDetectorRef,private adminService: AdminService,private route: ActivatedRoute) {
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
              text:"Select Group",
              selectAllText:'Select All',
              unSelectAllText:'UnSelect All',
              enableSearchFilter: true,
              classes:"form-control form-control-solid"
            };  


            this.GetAccountTypes(); 
            this.GetGroup();      
                       
            if(this.id > 0)
            {
              //alert("Edit User");
              this.usermodel.id=this.id
              this.GetUserById(this.usermodel.id);
            }
            else
            {
              this.usermodel.id=0;
              //alert("New User");
            }

 

  }

  GetAccountTypes() {
    this.adminService.GetAccountTypes().subscribe({
      next: (data: any) => {
        //debugger;
        this.UserAccountTypes = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  GetGroup() {
    this.adminService.GetGroup().subscribe({
      next: (data: any) => {
        //debugger;
        this.dropdownList = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  GetUserById(userId :any) {
    this.adminService.GetUserById(userId).subscribe({
      next: (data: any) => {
        debugger;
        this.usermodel = data;

        var itm=this.dropdownList;
        var dataToSend: any = [];
          var batches = this.usermodel.userGroups != null ? this.usermodel.userGroups.split(',') : [];
          batches.forEach(function (element: any) {
            var it= itm.filter((x:any)=> x.id==element);
            //alert(it.itemName);
            dataToSend.push({ "id": Number(element), "itemName": it[0].itemName});
          });

          this.selectedItems=dataToSend;
          //this.selectedItems = [{"id":1,"itemName":"Administrators"}];

        


      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  onItemSelect(item:any){
      console.log(item);
      console.log(this.selectedItems);
      this.EnableDisableAccount();
  }
  OnItemDeSelect(item:any){
      console.log(item);
      console.log(this.selectedItems);

      this.EnableDisableAccount();
     
  }
  onSelectAll(items: any){
      console.log(items);
      
      this.EnableDisableAccount();
  }
  onDeSelectAll(items: any){
      console.log(items);
      
      this.EnableDisableAccount();
  }
  EnableDisableAccount()
  {
    //debugger;
    const result1 = this.selectedItems.filter((x:any) => x.id === 4);
    const result2 = this.selectedItems.filter((x:any) => x.id === 3);
     
    if(result1.length>0)
      this.userForm.controls.AccountNumber.enable();
    else
    {
      this.userForm.controls.AccountNumber.disable();
      this.usermodel.accountNumber="";
    }
    if(result2.length>0)
    this.userForm.controls.OldVendor_Id.enable();
    else{
      this.usermodel.oldVendor_Id="";
      this.userForm.controls.OldVendor_Id.disable();
    }
    
  }

  
  saveSettings() {
    //debugger;
     
    var ctrl= this.userForm.controls;

    ////debugger;
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
    //debugger;
    var gropupIds ="";
    this.selectedItems.forEach((element:any) => {
      if(gropupIds=="")
          gropupIds=element.id
      else
        gropupIds= gropupIds +"," +element.id 

    });
    this.usermodel.userGroups=gropupIds;




    this.adminService.SaveUser(this.usermodel).subscribe({
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
          text: 'User saved successfully.',
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
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }




  onSubmit(data: any) {
    ////debugger;
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
         
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'User not saved.', 'error');
        }
      });
    }
  }

  keyPressNumbers(event: any) {
    ////debugger;
    var charCode = event.which ? event.which : event.keyCode;
    // Only Numbers 0-9
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }




}
