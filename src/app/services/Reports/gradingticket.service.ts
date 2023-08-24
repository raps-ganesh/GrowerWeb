import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GradingticketService {
  constructor(private http: HttpClient) {}
  BaseGradingTicket: string = environment.gradingApiBaseUrl; //  'https://localhost:7068/api/grading/';
  //BaseURL: string = 'https://localhost:7068/api/grading/gradingtickets/';
  private handleError(error: Response) {
    return '';
  }



  public GetWeighMastersByLocationAndFunction(
    locationName: string,
    scaleType: string
  ): Observable<any> {
    return this.http
      .get<any>(
        this.BaseGradingTicket +
          'getweighmastersbylocationandfunction/' +
          locationName +
          '/' +
          scaleType
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }




  public Weighmastercertificate(gradingTicketNumber: number): Observable<any> {
    return this.http
      .get<any>(
        this.BaseGradingTicket + 'weighmastercertificate/' + gradingTicketNumber
      )
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }
}
