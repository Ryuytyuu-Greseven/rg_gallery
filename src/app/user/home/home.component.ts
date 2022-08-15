import { SharedService } from './../../shared/shared.service';
import { CryptoService } from './../../crypto.service';
import { UserService } from './../user.service';
import {
  FormGroup,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  postForm!: FormGroup;
  mediaFile = '';
  extractedMediaFile: any = '';

  allArts: Array<any> = [];
  pageNo = 0;

  constructor(
    private formbuilder: FormBuilder,
    private userService: UserService,
    private cryptoService: CryptoService,
    private sharerdService: SharedService
  ) {}

  ngOnInit(): void {
    this.getAllPosts();
    this.postForm = this.formbuilder.group({
      description: new FormControl({ value: null, disabled: false }, [
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ]),
    });
  }

  checkFormState() {
    // console.log(this.postForm);
    const postMessage = this.postForm
      .get('description')
      ?.value.trim() as string;
    this.postForm.patchValue({
      description: postMessage,
    });
    this.postForm.updateValueAndValidity();
    if (
      this.postForm.invalid ||
      !this.extractedMediaFile ||
      !this.mediaFile ||
      !postMessage.length ||
      postMessage.length < 10
    ) {
      console.log('Requires At Least 10 Characters');
    } else {
      console.log('Publish Art!!');
      this.publishArt();
    }
  }

  onMediaChoosen(event: any) {
    console.log(event);
    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      if (file.size < 25000000) {
        const fileTypes = 'jpg|jpeg|png';
        console.log(file);
        const fileExtension = file.name.split('.').pop();
        if (fileTypes.match(fileExtension)) {
          this.extractedMediaFile = file;
          return true;
        } else {
          // later
          console.log('missmatch');
          this.mediaFile = '';
          return false;
        }
      } else {
        this.mediaFile = '';
        return false;
      }
    } else {
      this.mediaFile = '';
      return false;
    }
  }

  publishArt() {
    console.log('Please Hold!! We are Publishing Your Art 😊');
    const postData = new FormData();
    const body = {
      description: this.postForm.value.description,
    };
    postData.set('art_file', this.extractedMediaFile);
    console.log('\n F I L E\t--', postData.get('art_file'));

    const crypto_payload = this.cryptoService.encryptService(body);
    postData.append('body', `${crypto_payload}`);
    console.log('\nDESCRIPTION\t', postData.get('body'));

    this.userService.publishUserArt(postData).subscribe({
      next: (response: any) => {
        console.log(response);
        response = this.cryptoService.decryptService(response.spicy);
        console.log(response);
        if (response && response.success && response.data) {
          const post = response.data[0];
          post['profile_details'] = [
            { artist_name: this.sharerdService.userDetails.artist_name },
          ];
          this.resetForm();
          this.allArts = [...response.data, ...this.allArts.slice()];
        }
      },
      error: (error: any) => {
        console.log('Error While Publishing', error);
      },
    });
  }

  resetForm() {
    this.postForm.reset();
    this.mediaFile = '';
    this.extractedMediaFile = '';
  }

  // fetch posts
  getAllPosts() {
    // this.allArts.push
    this.pageNo++;
    const body = {
      pageNo: this.pageNo,
      // pageSize: 10,
      search: '',
    };

    this.userService.fetchArtPosts(body).subscribe({
      next: (response: any) => {
        console.log(response);
        response = this.cryptoService.decryptService(response.spicy);
        console.log(response);
        if (response.success && response.data && response.data.length) {
          this.allArts.push(...response.data);
        }
      },
      error: (error: any) => {
        console.log('Error While Publishing', error);
      },
    });
  }
}
