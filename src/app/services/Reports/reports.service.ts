import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(private http: HttpClient, private authService: AuthHTTPService) { }
  baseURL: string = environment.reportsBaseUrl;

  public PaymentReport(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseURL +
        'PaymentReport/' +
        data.cropyear +
        '?accountnumber=' +
        data.accountnumber +
        '&calculationbatchid=' +
        data.calculationbatchid +
        '&calculationBatchType=' +
        data.calculationBatchType
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetBatches(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseURL +
        'CalculationBatchByAccountNumber/' +
        data.cropyear +
        '?accountnumber=' +
        data.accountnumber +
        '&batchType=' +
        data.batchType
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetGrowerQualitySummaryDetailed(data: any): Observable<any> {
    debugger;
    return this.http
      .get<any>(
        this.baseURL +
        'getgrowerqualitysummarydetailed/' +
        '?sortcolumn=' +
        data.sortcolumn +
        '&sortDirection=' +
        data.sortdirection +
        '&searchByValue=' +
        encodeURIComponent(data.searchstring) +
        '&pagenumber=' +
        data.pagenumber +
        '&pagesize=' +
        data.pagesize +
        '&cropyear=' +
        data.cropyear +
        '&accountNo=' +
        data.accountNo
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  
}
