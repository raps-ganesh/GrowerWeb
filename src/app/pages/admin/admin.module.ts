import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddEditComponent } from './users/add-edit/add-edit.component';

import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { RouterModule } from '@angular/router';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { ModalsModule } from "../../_metronic/partials/layout/modals/modals.module";
import { WidgetsModule } from "../../_metronic/partials/content/widgets/widgets.module";
import { TypeAheadComponent } from './users/type-ahead/type-ahead.component';




@NgModule({
    declarations: [
        UsersComponent,
        AddEditComponent,
        ResetPasswordComponent,
        TypeAheadComponent
    ],
    imports: [
        CommonModule,
        InlineSVGModule,
        AngularMultiSelectModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ModalsModule,
        WidgetsModule
    ]
})
export class AdminModule { }
