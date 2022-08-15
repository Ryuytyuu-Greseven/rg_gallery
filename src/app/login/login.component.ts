import { Router } from '@angular/router';
import { SharedService } from './../shared/shared.service';
import { CryptoService } from './../crypto.service';
import { AppService } from './../app.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // START
  isLogin = true;
  errorMessage = '';

  public loginForm!: FormGroup;
  otpVerified = 'no';
  userOtp = '';
  userIdAvailable = true;
  userIdVerified = false;

  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private cryptoService: CryptoService,
    private sharedService: SharedService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const email_regex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i;
    this.loginForm = this.formBuilder.group({
      email: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.pattern(email_regex),
      ]),
      password: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(25),
      ]),
      check_password: new FormControl({ value: null, disabled: false }),
      otp: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(8),
      ]),
      user_id: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(25),
      ]),
      profile_name: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(30),
      ]),
    });
    console.log(this.loginForm);
  }

  switchLog() {
    this.isLogin = !this.isLogin;
    this.otpVerified = 'no';
    if (this.isLogin) {
      this.loginForm.get('check_password')?.reset();
      this.loginForm.get('check_password')?.clearValidators();
      this.loginForm.get('check_password')?.updateValueAndValidity();
    } else {
      this.loginForm.get('check_password')?.reset();
      this.loginForm
        .get('check_password')
        ?.addValidators([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(25),
        ]);
      this.loginForm.updateValueAndValidity();
    }
  }

  checkFormState() {
    console.log(this.loginForm);

    if (this.isLogin) {
      if (
        this.loginForm.get('email')?.valid ||
        this.loginForm.get('password')?.valid
      ) {
        this.login();
      }
    } else if (
      !this.isLogin &&
      this.otpVerified === 'no' &&
      this.loginForm.get('email')?.valid
    ) {
      this.otpVerified = 'inprogress';
      this.verifyEmails();
    } else {
      if (this.loginForm.invalid) {
        this.errorMessage = 'Pelase Enter Credentials';
        console.log('Pelase Enter Credentials');
      } else if (
        !this.isLogin &&
        this.loginForm.value.check_password !== this.loginForm.value.password
      ) {
        this.errorMessage = 'Passwords Missmatch';
        // this.loginForm.get('check_password')?.setErrors()
        console.log('Password Missmatch');
      } else {
        this.login();
      }
    }
  }

  login() {
    console.log('in login');
    const values = this.loginForm.value;
    let body: any = {
      brave_id: values.email,
      password: values.password,
    };
    console.log(body);
    if (this.isLogin) {
      this.appService.loginUser(body)?.subscribe({
        next: (response: any) => {
          console.log(response);
          response = this.cryptoService.decryptService(response.spicy);
          if (response.success) {
            sessionStorage.setItem(
              'squirrel_token',
              response.data.access_token
            );
            sessionStorage.setItem('email', body.brave_id);
            this.appService.userStatus = true;
            this.errorMessage = '';
            this.appService.userLogin();
            this.loginForm.reset();
            this.loginForm.updateValueAndValidity();
          } else {
            this.errorMessage = response.message;
          }
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
          this.errorMessage = 'Please Try Again. 🥲';
        },
      });
    } else {
      body = {
        ...body,
        user_id: values.user_id,
        profile_name: values.profile_name,
      };
      console.log(body);

      this.appService.signUpUser(body)?.subscribe({
        next: (response: any) => {
          console.log(response);
          response = this.cryptoService.decryptService(response.spicy);
          if (response.success) {
            sessionStorage.setItem(
              'squirrel_token',
              response.data.access_token
            );
            sessionStorage.setItem('email', body.brave_id);
            this.appService.userStatus = true;
            this.errorMessage = '';
            this.appService.userLogin();
            this.loginForm.reset();
            this.loginForm.updateValueAndValidity();
          }
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
          this.errorMessage = 'Please Try Again. 🥲';
        },
      });
    }
  }

  checkOtp() {
    if (
      this.loginForm.get('otp')?.valid &&
      this.loginForm.value.otp === this.userOtp
    ) {
      this.otpVerified = 'yes';
    } else {
      this.errorMessage = '🤔 Invalid OTP ⚠️';
    }
  }

  // verify emails
  verifyEmails() {
    console.log('In Verification Process');
    const body = {
      brave_id: this.loginForm.value.email,
    };

    this.appService.verifyEmail(body)?.subscribe({
      next: (response: any) => {
        console.log(response);
        response = this.cryptoService.decryptService(response.spicy);
        if (response.success) {
          this.errorMessage = '';
          this.userOtp = response.otp;
          // this.otpVerified = 'inprogress';
        }
        console.log(response);
      },
      error: (error: any) => {
        console.log(error);
        this.errorMessage = 'Please Try Again. 🥲';
      },
    });
  }

  checkUserId() {
    if (this.loginForm.get('user_id')?.valid) {
      const body = {
        user_id: this.loginForm.value.user_id,
      };

      this.appService.checkUserIdAvialability(body)?.subscribe({
        next: (response: any) => {
          console.log(response);
          response = this.cryptoService.decryptService(response.spicy);
          if (response.success) {
            this.errorMessage = '';
            this.userIdAvailable = true;
            this.userIdVerified = true;
          } else {
            this.errorMessage = response.message;
            this.userIdAvailable = false;
          }
          console.log(response);
        },
        error: (error: any) => {
          console.log(error);
          this.errorMessage = 'Please Try Again. 🥲';
        },
      });
    }
  }

  ngOnDestroy(): void {}
}
