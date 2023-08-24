import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceivingService {
  constructor(private http: HttpClient) {}

  baseReceivingTicket: string = environment.receivingApiBaseUrl;

  public getReceivingTickets(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseReceivingTicket +
          'ReceivingTickets/' +
          data.cropyear +
          '/' +
          data.status +
          '?location=' +
          data.location +
          '&sortcolumn=' +
          data.sortcolumn +
          '&sortDirection=' +
          data.sortdirection +
          '&searchByValue=' +
          encodeURIComponent(data.searchstring) +
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

  public getReceivingTicketDetails(receivingticketid: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseReceivingTicket + 'receivingTicketDetails/' + receivingticketid
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  public voidReceivingTicket(data: any) {
    return this.http
      .post(
        this.baseReceivingTicket +
          'voidreceivingticket/' +
          data.receivingticketid,
        data
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
  public Weighmastercertificate(receivingticketid: number): Observable<any> {
    return this.http
      .get<any>(
        this.baseReceivingTicket +
          'weighmastercertificatescalecopy/' +
          receivingticketid
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
