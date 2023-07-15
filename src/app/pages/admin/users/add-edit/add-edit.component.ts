import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  styleUrls: ['./add-edit.component.scss']
})
export class AddEditComponent implements OnInit {
  @ViewChild('userform') userform: NgForm;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];


  dropdownList :any = [];
  selectedItems:any = [];
  dropdownSettings:any = {};

  userForm: FormGroup;

  constructor(private cdr: ChangeDetectorRef) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }
  ngOnInit(): void {
        this.dropdownList = [
          {"id":1,"itemName":"India"},
          {"id":2,"itemName":"Singapore"},
          {"id":3,"itemName":"Australia"},
          {"id":4,"itemName":"Canada"},
          {"id":5,"itemName":"South Korea"},
          {"id":6,"itemName":"Germany"},
          {"id":7,"itemName":"France"},
          {"id":8,"itemName":"Russia"},
          {"id":9,"itemName":"Italy"},
          {"id":10,"itemName":"Sweden"}
        ];
    this.selectedItems = [
          
        ];
    this.dropdownSettings = { 
              singleSelection: false, 
              text:"Select Countries",
              selectAllText:'Select All',
              unSelectAllText:'UnSelect All',
              enableSearchFilter: true,
              classes:"form-control form-control-solid"
            };  
  }
  saveSettings() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }




  onSubmit(data: any) {
    //debugger;
    if (this.userform.invalid) {
      Swal.fire('Invalide', 'Please fill in all the required fields.', 'error');
    } else {
      Swal.fire({
        title: 'Confirm Ticket',
        text: 'Are you sure, you want to create ticket.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.value) {
          //this.CreateTicket('In Yard');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('Cancelled', 'Ticket not created.', 'error');
        }
      });
    }
  }

  keyPressNumbers(event: any) {
    //debugger;
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
