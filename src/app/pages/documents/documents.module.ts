import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageDocumentsComponent } from './manage-documents/manage-documents.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ModalsModule } from 'src/app/_metronic/partials';



@NgModule({
  declarations: [
    ManageDocumentsComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ModalsModule
  ]
})
export class DocumentsModule { }
