import { SharedService } from './shared/shared.service';
import { AppService } from './app.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'studio';

  displayHeaders = false;
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.appService.userLoginStatus.subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.displayHeaders = true;
        } else {
          this.displayHeaders = false;
        }
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.log('something completed');
      },
    });

    if (sessionStorage.getItem('squirrel_token')) {
      this.appService.userLogin();
    }
  }
}
