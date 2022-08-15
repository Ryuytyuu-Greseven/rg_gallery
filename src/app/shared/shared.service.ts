import { Router } from '@angular/router';
import { AppService } from './../app.service';
import { AppSettings } from './../app.settings';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SharedService {
  // public userLoginStatus!: BehaviorSubject<{ status: boolean }>;

  public userDetails: any = {};

  constructor(
    private appSettings: AppSettings,
    private appService: AppService
  ) {}

  // // login user
  // loginUser(body: any) {
  //   const url = this.appSettings.API.LOGIN;
  //   return this.appService.callAPi({ body, method: 'post', url });
  // }

  // // signup user
  // signUpUser(body: any) {
  //   const url = this.appSettings.API.SIGN_UP;
  //   return this.appService.callAPi({ body, method: 'post', url });
  // }
}
