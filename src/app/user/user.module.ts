import { UserService } from './user.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { PostCardComponent } from './post-card/post-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [HomeComponent, PostCardComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [UserService],
})
export class UserModule {}
