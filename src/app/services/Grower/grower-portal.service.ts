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
  growerAccountingUrl: any = environment.growerAccountingApiBaseUrl;

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

  public GetUserAccounts(userId: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseUrl + 'GetUserAccounts/' + userId
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetJdeAddressBookNumber(accountNumber: any): Observable<any> {
    return this.http
      .get<any>(
        this.growerAccountingUrl + 'GetJdeAddressBookNumber/' + accountNumber
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetAccountsDetails(accountNumber: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseUrl + 'AccountsDetails/' + accountNumber
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }


}
