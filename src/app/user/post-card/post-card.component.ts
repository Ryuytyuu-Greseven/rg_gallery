import { CryptoService } from './../../crypto.service';
import { UserService } from './../user.service';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.css'],
})
export class PostCardComponent implements OnInit, OnChanges {
  constructor(
    private userService: UserService,
    private cryptoService: CryptoService
  ) {}
  imageSrc: any = '';

  userVote = 0;

  @Input() artPost: any = {};

  ngOnInit(): void {
    console.log(this.artPost);
    if (
      this.artPost.user_liked_details &&
      this.artPost.user_liked_details.length
    ) {
      this.userVote = parseInt(this.artPost.user_liked_details[0].type, 0);
    }
    this.fetchArt(this.artPost.file_name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);
  }

  onUpvote() {
    console.log('IN UpVOte');
    let body: any = {};
    if (this.userVote === 1) {
      body = {
        id: this.artPost._id,
        vote_id: this.artPost.user_liked_details[0]._id,
        upvote: 0,
      };
    } else if (this.userVote === 2) {
      body = {
        id: this.artPost._id,
        vote_id: this.artPost.user_liked_details[0]._id,
        upvote: 1,
      };
    } else if (this.userVote === 0) {
      body = {
        id: this.artPost._id,
        upvote: 1,
      };
    }
    this.userService.artVote(body).subscribe({
      next: (response: any) => {
        console.log(response);
        response = this.cryptoService.decryptService(response.spicy);
        console.log(response);
        if (response.success && response.data && response.data.length) {
          this.userVote = body.upvote;
          this.artPost = response.data[0];
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  onDownvote() {
    console.log('IN Downvote');
    let body: any = {};
    if (this.userVote === 1) {
      body = {
        id: this.artPost._id,
        vote_id: this.artPost.user_liked_details[0]._id,
        downvote: 1,
      };
    } else if (this.userVote === 2) {
      body = {
        id: this.artPost._id,
        vote_id: this.artPost.user_liked_details[0]._id,
        downvote: 0,
      };
    } else if (this.userVote === 0) {
      body = {
        id: this.artPost._id,
        downvote: 1,
      };
    }
    this.userService.artVote(body).subscribe({
      next: (response: any) => {
        console.log(response);
        response = this.cryptoService.decryptService(response.spicy);
        console.log(response);
        if (response.success && response.data && response.data.length) {
          this.userVote = body.downvote === 1 ? 2 : 0;
          this.artPost = response.data[0];
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  fetchArt(file_name: string) {
    this.userService.fetchUserArt(file_name).subscribe({
      next: (response: any) => {
        console.log(response);
        // this.imageSrc = `data:image/${file_type};base64,` + response.data;
        const base64String = this.arrayBufferToBase64(
          response.data.data,
          file_name
        );
        this.imageSrc = base64String;
        // console.log(base64String);
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  arrayBufferToBase64(buffer: any, file_name: string) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const file_type = file_name.split('.').pop();

    return `data:image/${file_type};base64,` + window.btoa(binary);
  }
}
