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
        'gp_getgrowerqualitysummarydetailed/' +
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

  public GetReceivingTickets(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseURL +
        'ReceivingTickets/' +
        data.cropyear +
        '/' +
        data.accountnumber
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetDehydratorDeliveries(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseURL +
        'DehydratorDeliveries/' +
        data.cropyear +
        '/' +
        data.accountnumber
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public YearEndStatement(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseURL +
        'YearEndStatement/' +
        data.StatementYear +
        '?accountnumber=' +
        data.accountnumber
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }


  public DeferredStatement(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseURL +
        'deferredstatement/' +
        data.StatementYear +
        '?accountnumber=' +
        data.accountnumber + '&calculationBatchId=' + data.calculationBatchId
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
