import { HttpClient, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DocumentService } from 'src/app/services/Document/document.service';
import { ExcelService } from 'src/app/services/Excel/excel.service';
import { AppSettingsService } from 'src/app/shared/app-settings.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
  
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  id:any;
  DocId: number=0;
  constructor(
    private cdr: ChangeDetectorRef,
    private documentService: DocumentService,
    public appSettingService: AppSettingsService,
    private excelService: ExcelService,
    private route: ActivatedRoute,
    private http : HttpClient, private router: Router
  ) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.id = this.route.snapshot.paramMap.get('id1');

    if(this.id > 0)
    {
      this.DocId=this.id;
    }
    else
    {
      this.DocId = 0;
    }

    
   }
   
   ngOnInit(): void {
    this.GetAccountTypes();

    if(this.id > 0)
            {
              
              this.GetDocumentById(this.id);
            }
            else
            {
              this.DocId=0;
              //alert("New User");
            }
   }

  cropYear:any;
  documentTypes:any;
  SelectDocument:any;
  SelectThumbnail:any;
  Title:any;
  DocumentTypeId : any;
  modifiedOn :any;
  Description:any


  GetDocumentById(id:any)
  {
    this.documentService.GetDocumentById(id).subscribe({
      next: (data: any) => {
        
        //this.usermodel = data;
        this.Title=data.title;
        this.DocumentTypeId=data.type;
        this.Description=data.description;
        this.modifiedOn=data.modifiedOn;
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

  file:any;
  fileThumb:any;
  progress: number;
  message: string;
  @Output() public onUploadFinished = new EventEmitter();
  response:any;
  onFileSelected(event:any)
  {
    this.file=event.target.files[0];
  }

  onFileThumbSelected(event:any)
  {
    this.fileThumb=event.target.files[0];
  }

  saveDocument()
  {
    debugger;

    if(this.file!=undefined)
    {

      let formData = new FormData();
      var name=this.file.name;
      formData.set('name',this.Title);
      formData.set('file',this.file);

      formData.append('file', this.fileThumb, this.fileThumb.name);

      
      this.http.post(this.documentService.UploadDocumentUrl(), formData, {reportProgress: true, observe: 'events'})
        .subscribe({
          next: (event) => {
          if (event.type === HttpEventType.UploadProgress)
            this.progress = Math.round(100 * event.loaded / (event.total || 1));
          else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';

            this.response=event.body;
            alert//(this.response.imagePath);

            this.documentService.saveDocument({
              id:this.DocId,
              title:this.Title,
              description:this.Description,
              pdfFileName:this.response.pdfFileName,
              pdfUrl:this.response.pdfUrl,
              documentTypeId:this.DocumentTypeId,
              thumbnailUrl :this.response.thumbnailUrl,
              thumbnailName : this.response.thumbnailName,
              isActive:true,
              modifiedOn:this.modifiedOn
            })
            .subscribe({
              error: (e: any) => {
                Swal.fire({
                  html: e.error,
                  icon: 'error',
                  buttonsStyling: false,
                  confirmButtonText: 'Ok, got it!',
                  customClass: {
                    confirmButton: 'btn btn-primary',
                  },
                });
              },
              complete: () => {
                Swal.fire({
                  html: 'Document saved successfully.',
                  icon: 'success',
                  buttonsStyling: false,
                  confirmButtonText: 'Ok, got it!',
                  customClass: {
                    confirmButton: 'btn btn-primary',
                  },
                });
                this.router.navigateByUrl('/documents');
              },
            });

            this.onUploadFinished.emit(event.body);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err)
      });
    }
    else{

      this.documentService.saveDocument({
        id:this.DocId,
        title:this.Title,
        description:this.Description,
        documentTypeId:this.DocumentTypeId,
        isActive:true,
        modifiedOn:this.modifiedOn
      })
      .subscribe({
        error: (e: any) => {
          Swal.fire({
            html: e.error,
            icon: 'error',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
        },
        complete: () => {
          Swal.fire({
            html: 'Document saved successfully.',
            icon: 'success',
            buttonsStyling: false,
            confirmButtonText: 'Ok, got it!',
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          });
          this.router.navigateByUrl('/documents');
        },
      });

    }
    


    






    

  }

  

}
