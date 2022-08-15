import { Injectable } from '@angular/core';
import { environment } from './../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class AppSettings {
  constructor() {}
  public API = {
    LOGIN: environment.apiUrl + 'auth/login',
    SIGN_UP: environment.apiUrl + 'auth/signup',
    VERIFY_EMAIL: environment.apiUrl + 'auth/check_signup',
    CHECK_USER_ID: environment.apiUrl + 'auth/check_userid',

    // profile details
    PROFILE_DETAILS: environment.apiUrl + 'artist/fetch_artist_details',

    // posts
    POST_ART: environment.apiUrl + 'artist/post_art',
    GET_ARTS: environment.apiUrl + 'artist/get_arts',
    FETCH_ART: environment.apiUrl + 'artist/fetch_art/',

    // upvote and downvote
    ART_UP_DOWN_VOTE: environment.apiUrl + 'artist/art_vote',
  };
}
