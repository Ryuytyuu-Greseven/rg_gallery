import { AppService } from './../app.service';
import { AppSettings } from './../app.settings';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private appSettings: AppSettings,
    private appService: AppService
  ) {}

  // publish user art
  fetchArtistDetails() {
    const url = this.appSettings.API.PROFILE_DETAILS;
    return this.appService.callAPi({ body: {}, method: 'post', url });
  }

  // publish user art
  publishUserArt(body: any) {
    const url = this.appSettings.API.POST_ART;
    return this.appService.callAPi({ body, method: 'file_upload', url });
  }

  // publish user art
  fetchUserArt(id: string) {
    const url = this.appSettings.API.FETCH_ART + id;
    return this.appService.callAPi({ body: null, method: 'get', url });
  }

  // fetch all art posts
  fetchArtPosts(body: any) {
    const url = this.appSettings.API.GET_ARTS;
    return this.appService.callAPi({ body, method: 'post', url });
  }

  artVote(body: any) {
    const url = this.appSettings.API.ART_UP_DOWN_VOTE;
    return this.appService.callAPi({ body, method: 'post', url });
  }
}
