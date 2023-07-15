import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthHTTPService } from 'src/app/modules/auth/services/auth-http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient, private authService: AuthHTTPService) {}
  baseAdminURL: string = environment.adminApiBaseUrl;



  public getUsers(data: any): Observable<any> {
    return this.http
      .get<any>(
        this.baseAdminURL +
          'GetUsers/' +
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


}
