export class AuthModel {
  authToken: string;
  authAPIToken: string;
  refreshToken: string;
  expiresIn: Date;
  authenticationType: any;
  phoneNumber: any;
  setAuth(auth: AuthModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}
