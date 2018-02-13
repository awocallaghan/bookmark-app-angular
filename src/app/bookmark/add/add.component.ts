/**
 * BookmarkAddComponent
 * - Create a new bookmark using BookmarkFormComponent
 * - Redirect to results page on completion passing bookmark id param
 */
import { Component } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl
} from '@angular/forms';
import { Router } from '@angular/router';

import { BookmarkService } from './../../services/bookmark.service';
import { Bookmark } from './../../models/bookmark';

@Component({
  selector: 'app-bookmark-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class BookmarkAddComponent {

  constructor(
    private router: Router
  ) {}

  onComplete(bookmark: Bookmark): void {
    // Redirect to results page
    this.router.navigateByUrl(`/result/${bookmark.id}`);
  }
}
