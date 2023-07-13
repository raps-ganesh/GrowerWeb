import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { InlineSVGModule } from 'ng-inline-svg-2';


@NgModule({
  declarations: [
    UsersComponent
  ],
  imports: [
    CommonModule,InlineSVGModule,
  ]
})
export class AdminModule { }
