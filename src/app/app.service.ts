import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { CryptoService } from './crypto.service';
import { AppSettings } from './app.settings';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  public userStatus = false;
  public userLoginStatus = new BehaviorSubject<{ status: boolean }>({
    status: false,
  });

  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private cryptoService: CryptoService,
    private router: Router
  ) {}

  callAPi(request: { method: string; body: any; url: string }) {
    // console.log(request.body.get('art_file'));
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${sessionStorage.getItem('squirrel_token')}`,
    });

    const multi_part_httpHeader = new HttpHeaders({
      // 'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${sessionStorage.getItem('squirrel_token')}`,
    });

    switch (request.method) {
      case 'get':
        return this.http
          .get(request.url, { headers: httpHeader })
          .pipe((response) => {
            return response;
          });
        break;
      case 'post':
        const cryopto_body = this.cryptoService.encryptService(request.body);
        // console.log({ stinky: cryopto_body });

        return this.http
          .post(request.url, { stinky: cryopto_body }, { headers: httpHeader })
          .pipe((response) => {
            return response;
          });
        break;
      case 'file_upload':
        // for the movement do not use content-type header, it's causing lot's of issues and tried to fix it,
        // but none of them worked and wasted 4hr's.🥲
        return this.http
          .post(request.url, request.body, {
            headers: multi_part_httpHeader,
          })
          .pipe((response) => {
            return response;
          });
        break;
      default:
        return this.http.options(request.url);
        break;
    }
  }

  userLogin() {
    this.router.navigate(['/home']);
    this.userStatus = true;
    this.userLoginStatus.next({ status: true });
    // return this.http.get
  }

  logOut() {
    this.userStatus = false;
    sessionStorage.removeItem('squirrel_token');
    sessionStorage.removeItem('email');
    this.userLoginStatus.next({ status: false });
    this.router.navigate(['/login']);
  }

  // login user
  loginUser(body: any) {
    const url = this.appSettings.API.LOGIN;
    return this.callAPi({ body, method: 'post', url });
  }

  // signup user
  signUpUser(body: any) {
    const url = this.appSettings.API.SIGN_UP;
    return this.callAPi({ body, method: 'post', url });
  }

  // send otp to user email and verify
  verifyEmail(body: any) {
    const url = this.appSettings.API.VERIFY_EMAIL;
    return this.callAPi({ body, method: 'post', url });
  }

  // check user requested user id is available or not
  checkUserIdAvialability(body: any) {
    const url = this.appSettings.API.CHECK_USER_ID;
    return this.callAPi({ body, method: 'post', url });
  }
}
