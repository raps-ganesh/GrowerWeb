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


  
  public GetAccountTypes(): Observable<any> {
    return this.http
      .get<any>(this.baseAdminURL + 'getaccounttypes')
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetGroup(): Observable<any> {
    return this.http
      .get<any>(this.baseAdminURL + 'getgroups')
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public GetUserById(userId :any): Observable<any> {
    return this.http
      .get<any>(this.baseAdminURL + 'GetUserById/'+userId)
      .pipe(
        map((response: any) => {
          return response;
        })
      );
  }

  public SaveUser(user:any): Observable<any> {
    //debugger;
    return this.http
      .post<any>(
        'https://localhost:7061/api/Admin/SaveUser/' + user.id,
        user
      )
      .pipe(
        map((response: any) => {
          //debugger;
          return response;
        })
      );
  }

  ResetPassword(UserId: any, password: any): Observable<any> {
    return this.http
    .post<any>(
      'https://localhost:7061/api/Admin/UpdatePassword/' + UserId+'?password='+password, password
    )
    .pipe(
      map((response: any) => {
        //debugger;
        return response;
      })
    );
  }

  public DeleteUser(userid:any): Observable<any> {
    //debugger;
    return this.http
      .post<any>(
        'https://localhost:7061/api/Admin/DeleteUser/'+userid,userid
      )
      .pipe(
        map((response: any) => {
          //debugger;
          return response;
        })
      );
  }

  public SaveGroup(userid:any,groupids:any): Observable<any> {
    debugger;
    return this.http
      .post<any>(
        'https://localhost:7061/api/Admin/SaveUserGroup/' + userid ,groupids
      )
      .pipe(
        map((response: any) => {
          //debugger;
          return response;
        })
      );
  }


}
