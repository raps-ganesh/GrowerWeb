import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DocumentService } from 'src/app/services/Document/document.service';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  id: any;
  constructor(
    private cdr: ChangeDetectorRef,
    private documentService: DocumentService,
    public appSettingService: AppSettingsService,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private http : HttpClient
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.id = this.route.snapshot.paramMap.get('id1');

    
   }
   
   ngOnInit(): void {
    this.GetAccountTypes();

    if(this.id > 0)
            {
              
              this.GetDocumentById(this.id);
            }
            else
            {
              //this.usermodel.id=0;
              //alert("New User");
            }
   }

  cropYear:any;
  documentTypes:any;
  SelectDocument:any;
  SelectThumbnail:any;
  Title:any;
  DocumentTypeId : any;
  UpdatedOn :any;
  Description:any


  GetDocumentById(id:any)
  {
    this.documentService.GetDocumentById(id).subscribe({
      next: (data: any) => {
        
        //this.usermodel = data;
        this.Title=data.title;
        this.DocumentTypeId=data.type;
        this.Description=data.description;
        this.UpdatedOn=data.modifiedOn;
        this.DocumentTypeId=data.documentTypeId;

      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  GetAccountTypes() {
    this.documentService.GetDocumentTypes().subscribe({
      next: (data: any) => {
        //
        this.documentTypes = data;
      },
      error: (err: any) => {
        console.log(err);
      },
    });
  }

  saveDocument()
  {
    let formData = new FormData();
    formData.set('name',this.Title);
    formData.set('file',this.file);
    this.http.post('http://localhost:4200/documents/Upload/files',formData)
    .subscribe((response)=>{

    })
    {

    }





  }

  file:any;
  onFileSelected(event:any)
  {
    this.file=event.target.files[0];
  }

}
