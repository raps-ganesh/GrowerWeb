import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditComponent } from './users/add-edit/add-edit.component';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    UsersComponent,
    AddEditComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    AngularMultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
    

  ]
})
export class AdminModule { }
