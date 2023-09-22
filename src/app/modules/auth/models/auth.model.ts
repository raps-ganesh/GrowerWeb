export class AuthModel {
  authToken: string;
  authAPIToken: string;
  refreshToken: string;
  expiresIn: Date;
  authenticationType: any;
  phoneNumber: any;
  userName: any;
  isMFAConfigured: any;
  isAdmin: any;
  setAuth(auth: AuthModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}
