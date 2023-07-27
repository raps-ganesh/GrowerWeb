import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  
 

  constructor(private http: HttpClient, private authService: AuthHTTPService) {}
  baseDocumentURL: string = environment.documentApiBaseUrl;


  GetDocumentById(id :any) : Observable<any>
  {
    return this.http
    .get<any>(this.baseDocumentURL + 'GetDocumentById/'+id)
    .pipe(
      map((response: any) => {
        return response;
      })
    );
  }

  GetDocumentTypes() : Observable<any>{
    return this.http
    .get<any>(this.baseDocumentURL + 'getdocumenttypes')
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  public GetDocumentsByType(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseDocumentURL +
          'GetDocumentsByType/' +
          '?sortcolumn=' +
          data.sortcolumn +
          '&sortDirection=' +
          data.sortdirection +
          '&searchByValue=' +
          data.searchstring +
          '&pagenumber=' +
          data.pagenumber +
          '&pagesize=' +
          data.pagesize+
          '&documentType='+
          data.DocTypeId
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetDocuments(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseDocumentURL +
          'GetDocuments/' +
          '?sortcolumn=' +
          data.sortcolumn +
          '&sortDirection=' +
          data.sortdirection +
          '&searchByValue=' +
          data.searchstring +
          '&pagenumber=' +
          data.pagenumber +
          '&pagesize=' +
          data.pagesize
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  DeleteDocument(docId: any): Observable<any> {
    return this.http
    .post<any>(
      this.baseDocumentURL +'DeleteDocument/'+docId,docId
    )
    .pipe(
      map((response: any) => {
        //
        return response;
      })
    );
  }
}
