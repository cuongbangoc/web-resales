import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Constants } from '../constants';
import { Auth } from 'src/app/shared/models/result-login.model';
import { CookieService } from 'ngx-cookie-service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CustomerItem } from 'src/app/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private loginUrl: string = Constants.CATALOG_URL + 'login';
  private cookiesUserKey = 'auth';
  private _token: string;
  private jwtHelper = new JwtHelperService();
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private dialogRef: MatDialog,
    private router: Router
  ) { }

  setAuth(auth: Auth) {
    this.cookieService.set(this.cookiesUserKey, JSON.stringify(auth));
    this._token = auth.token;
  }

  getAuth() {
    return JSON.parse(this.cookieService.get(this.cookiesUserKey) || '{}');
  }

  login(email: string, password: string): Observable<Auth> {
    return this.httpClient.post<Auth>(this.loginUrl, { email, password });
  }

  get getToken() {
    return this._token ? this._token : this.getAuth().token;
  }

  logout(showMessage = false): void {
    this.cookieService.deleteAll(this.cookiesUserKey);
    this._token = undefined;
    this.dialogRef.closeAll();
    this.router.navigateByUrl('/login');

  }

  public editProfileUser(password: string, fullName: string, phoneNumber: string): Observable<CustomerItem> {
    return this.httpClient.post<any>(Constants.BASE_API_URL + 'users/updateUser', { password, fullName, phoneNumber });
  }

}
