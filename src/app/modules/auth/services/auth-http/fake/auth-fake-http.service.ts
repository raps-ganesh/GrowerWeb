import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserModel } from '../../../models/user.model';
import { AuthModel } from '../../../models/auth.model';
import { UsersTable } from '../../../../../_fake/users.table';
import { environment } from '../../../../../../environments/environment';



const API_USERS_URL = `${environment.apiUrl}/users`;

@Injectable({
  providedIn: 'root',
})
export class AuthHTTPService {
  constructor(private http: HttpClient) { }

  VerifyOTP(email: string, authType: string, phoneNo: string, otp: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    return this.http
      .get(
        environment.growerPortalApiBaseUrl + 'VerifyOTP?userName={0}&authType={1}&phoneNo={2}&otp={3}'
          .replace('{0}', encodeURIComponent(email))
          .replace('{1}', encodeURIComponent(authType))
          .replace('{2}', encodeURIComponent(phoneNo))
          .replace('{3}', encodeURIComponent(otp))
      ).pipe(
        map((result: any) => {
          debugger;
          if (result == null || result.Value == 'Invalid OTP') {
            return "Invalid OTP";
          }

          localStorage.setItem('AuthenticationType', result.authenticationType);
          const auth = new AuthModel();
          auth.authAPIToken = result.authToken;
          auth.authToken = 'auth-token-8f3ae836da744329a6f93bf20594b5cc';
          auth.refreshToken = 'auth-token-f8c137a2c98743f48b643e71161d90aa';
          auth.expiresIn = new Date(Date.now() + 2 * 60 * 60 * 1000);

          localStorage.setItem('loggedinUser', result.username);
          localStorage.setItem('UserId', result.userId);
          localStorage.setItem('JDENumber', result.oldVendor_Id);

          localStorage.setItem(
            'loggedinUserRoles',
            JSON.stringify(result.groups)
          );
          localStorage.setItem('loggedinData', JSON.stringify(result));
          localStorage.setItem('apitkn', result.authToken);
          localStorage.setItem('AuthenticationType', result.authenticationType);

          return auth;
        })
      );
  }


  // public methods
  login(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    return this.http
      .get(
        environment.authenticationApiUrl
          .replace('{0}', encodeURIComponent(email))
          .replace('{1}', encodeURIComponent(password))
      ).pipe(
        map((result: any) => {
          debugger;
          if (result.username == undefined) {
            return notFoundError;
          }

          // if(result.authenticationType==1)
          // {
          //   debugger;
          //   //return notFoundError;
          // }

          localStorage.setItem('AuthenticationType', result.authenticationType);
          const auth = new AuthModel();
          auth.authAPIToken = result.authToken;
          auth.authToken = 'auth-token-8f3ae836da744329a6f93bf20594b5cc';
          auth.refreshToken = 'auth-token-f8c137a2c98743f48b643e71161d90aa';
          auth.expiresIn = new Date(Date.now() + 2 * 60 * 60 * 1000);
          auth.authenticationType = result.authenticationType;
          auth.phoneNumber = result.phoneNo;
          localStorage.setItem('loggedinUser', result.username);
          localStorage.setItem('UserId', result.userId);
          localStorage.setItem('JDENumber', result.oldVendor_Id);

          localStorage.setItem(
            'loggedinUserRoles',
            JSON.stringify(result.groups)
          );
          localStorage.setItem('loggedinData', JSON.stringify(result));
          localStorage.setItem('apitkn', result.authToken);
          localStorage.setItem('AuthenticationType', result.authenticationType);

          return auth;
        })
      );
  }

  prelogin(email: string, password: string): Observable<any> {
    const notFoundError = new Error('Not Found');
    if (!email || !password) {
      return of(notFoundError);
    }

    return this.http
      .get(
        environment.growerPortalApiBaseUrl + 'preauthenticate?username={0}&password={1}'
          .replace('{0}', encodeURIComponent(email))
          .replace('{1}', encodeURIComponent(password))
      ).pipe(
        map((result: any) => {

          if (result.username == undefined) {
            return notFoundError;
          }
          const auth = new AuthModel();
          auth.authAPIToken = result.authToken;
          auth.authToken = 'auth-token-8f3ae836da744329a6f93bf20594b5cc';
          auth.refreshToken = 'auth-token-f8c137a2c98743f48b643e71161d90aa';
          auth.expiresIn = new Date(Date.now() + 2 * 60 * 60 * 1000);
          auth.authenticationType = result.authenticationType;
          auth.phoneNumber = result.phoneNo;
          return auth;
        })
      );
  }

  getLoggedInUserName() {
    return localStorage.getItem('loggedinUser');
  }
  createUser(user: UserModel): Observable<any> {
    user.roles = [2]; // Manager
    user.authToken = 'auth-token-' + Math.random();
    user.refreshToken = 'auth-token-' + Math.random();
    user.expiresIn = new Date(Date.now() + 100 * 24 * 60 * 60 * 1000);
    user.pic = './assets/media/avatars/300-1.jpg';

    return this.http.post<UserModel>(API_USERS_URL, user);
  }

  forgotPassword(email: string): Observable<boolean> {
    return this.getAllUsers().pipe(
      map((result: UserModel[]) => {
        const user = result.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        );
        return user !== undefined;
      })
    );
  }

  getUserByToken(token: string): Observable<UserModel | undefined> {



    if (localStorage.getItem('loggedinUser') == null) {
      return of(undefined);
    }

    if (new Number(localStorage.getItem('AuthenticationType')) > 0 && new Boolean(localStorage.getItem('IsOTPAuthenticated')) == false) {
      return of(undefined);
    }


    const newUser = UsersTable.users.find((u: UserModel) => {
      return u.authToken === token;
    });

    if (!newUser) {
      return of(undefined);
    }

    newUser.firstname = localStorage.getItem('loggedinUser')!;
    newUser.authenticationType = localStorage.getItem('AuthenticationType');
    return of(newUser);
  }

  getAllUsers(): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(API_USERS_URL);
  }



}
