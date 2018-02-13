/**
 * BookmarkFormComponent
 * - Used for creating and updating Bookmarks
 * - Validates URL using RegEx pattern
 * - Handles calls to BookmarkService methods to create/update Bookmark
 */
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  selector: 'app-bookmark-form',
  templateUrl: './form.component.html',
  styleUrls: [
    './../../buttons.css',
    'form.component.css'
  ]
})
export class BookmarkFormComponent implements OnInit {
  @Input() bookmark: Bookmark = null;
  @Input() buttonText: string;
  // Whether to show a cancel button (used when editing not creating)
  @Input() showCancel = false;
  // Emit success event with the user inputted Bookmark
  @Output() completeEvent: EventEmitter<Bookmark> = new EventEmitter();
  // Emit cancel event when editing an existing bookmark
  @Output() cancelEvent: EventEmitter<boolean> = new EventEmitter();
  // FormGroup with validations
  form: FormGroup;
  // Loading status
  submitting = false;
  // Error messages
  errors: string[] = [];

  constructor(
    private bookmarkService: BookmarkService
  ) {}

  ngOnInit(): void {
    // Create form group + controls on init
    this.form = new FormGroup({
      'protocol': new FormControl(
        this.bookmark == null ? 'https://' : this.bookmark.protocol,
        [
          Validators.pattern(/http(s)?\:\/\//)
        ]
      ),
      'url': new FormControl(
        this.bookmark == null ? '' : this.bookmark.url,
        [
          Validators.required,
          Validators
            // [A-Za-z0-9]+ = match first subdomain
            // (\.[A-Za-z0-9]+)* = match 0 or many more subdomains/tld
            // (\:[0-9]{1,4})? = allow an optional port number
            // (\/([A-Za-z0-9_.%/\-?=&#])+)? = allow special characters in path after "/"
            .pattern(/^[A-Za-z0-9]+(\.[A-Za-z0-9]+)*(\:[0-9]{1,4})?(\/([A-Za-z0-9_.%/\-?=&#])*)?$/)
        ]
      )
    });
  }

  // URL input key event
  onKey(url: string): void {
    // If url input starts with protocol update protocol field value
    const protocolPattern = /http(s)?\:\/\//;
    if (protocolPattern.test(url.substr(0, 8))) {
      this.form.setValue({
        protocol: url.match(protocolPattern)[0],
        url: url.replace(protocolPattern, '')
      });
    }
  }

  // Getters for form inputs
  get protocol(): AbstractControl {
      return this.form.get('protocol');
  }

  get url(): AbstractControl { 
    return this.form.get('url');
  }

  submit(): void {
    if (this.form.valid) {
      this.submitting = true;
      // Get empty bookmark or existing if updating
      const bookmark = this.bookmark == null ? {} as Bookmark : this.bookmark;
      // Set values from form
      bookmark.protocol = this.protocol.value;
      bookmark.url = this.url.value;
      if (bookmark.hasOwnProperty('id')) {
          // Update the bookmark
          this.update(bookmark);
      } else {
          // Create the bookmark
          this.create(bookmark);
      }
    }
  }

  private create(bookmark: Bookmark): void {
    this.bookmarkService.add(bookmark)
      .subscribe(
        createdBookmark => {
          // Bookmark created: emit success + reset form
          this.completeEvent.emit(createdBookmark);
          this.form.reset();
          this.form.setValue({
            protocol: 'https://',
            url: ''
          });
          this.submitting = false;
        },
        error => {
          // Error creating bookmark
          this.errors = [error];
          this.submitting = false;
        }
      );
  }

  private update(bookmark: Bookmark): void {
    this.bookmarkService.update(bookmark.id, bookmark)
      .subscribe(
        updatedBookmark => {
          // Bookmark updated: emit success
          this.completeEvent.emit(updatedBookmark);
          this.submitting = false;
        },
        error => {
          // Error updating bookmark
          this.errors = [error];
          this.submitting = false;
        }
      );
  }
}
