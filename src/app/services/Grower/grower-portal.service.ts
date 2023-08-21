import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GrowerPortalService {

  constructor(private http: HttpClient) { }
  baseUrl: string = environment.growerPortalApiBaseUrl;

  public GetUserAccountbyJDE(jdenumber: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseUrl + 'GetUserAccountbyJDE?JDELongAddressBookNumber=' + jdenumber
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetUserAccounts(jdenumber: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseUrl + 'GetUserAccounts?JDELongAddressBookNumber=' + jdenumber
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
