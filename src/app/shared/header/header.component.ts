import { CryptoService } from './../../crypto.service';
import { UserService } from './../../user/user.service';
import { AppService } from './../../app.service';
import { SharedService } from './../shared.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css', '../../../../src/styles.css'],
})
export class HeaderComponent implements OnInit {
  userLoggedIn = false;

  profileDetails: any = {};
  copiedText = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private appService: AppService,
    private userService: UserService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    this.userStatus();
    this.getUserDetails();
  }

  userStatus() {
    this.appService.userLoginStatus.subscribe({
      next: (response: any) => {
        if (response && response.status) {
          this.userLoggedIn = true;
        } else {
          this.userLoggedIn = false;
        }
      },
      error: (error: any) => {
        console.log(error);
      },
      complete: () => {
        console.log('something completed');
      },
    });
  }

  getUserDetails() {
    console.log('Fetching Profile Details');

    this.profileDetails = {};
    this.userService.fetchArtistDetails().subscribe({
      next: (response: any) => {
        console.log(response);
        if (response && response.spicy) {
          response = this.cryptoService.decryptService(response.spicy);
          console.log(response);
          if (response && response.success && response.details) {
            this.profileDetails = response.details;
            this.sharedService.userDetails = this.profileDetails;
          }
        }
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  onLogout() {
    this.appService.logOut();
  }

  onShare() {
    navigator.clipboard.writeText(window.origin);
    this.copiedText = true;
    setTimeout(() => {
      this.copiedText = false;
    }, 2000);
    console.log('Copied Text!');
  }

  navigate(path: string) {
    this.router.navigate([`${path}`]);
  }
}
