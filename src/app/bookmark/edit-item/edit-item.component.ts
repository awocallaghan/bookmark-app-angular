/**
 * BookmarkEditItemComponent
 * - Show a bookmark that can be edited/deleted (used in list)
 * - BookmarkService calls are handled by child BookmarkFormComponent
 * - Allow toggling of edit mode
 */
import { Component, Output, EventEmitter } from '@angular/core';

import { Bookmark } from '../../models/bookmark';

import { BookmarkItemComponent } from './../item/item.component';

@Component({
  selector: 'app-bookmark-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: [
    './../../buttons.css',
    './../item/item.component.css', 
    './edit-item.component.css'
  ]
})
export class BookmarkEditItemComponent extends BookmarkItemComponent {
  // Delete event (trigger deletion of this item)
  @Output() deleteEvent: EventEmitter<Bookmark> = new EventEmitter();
  // Update event (trigger update of this item)
  @Output() updateEvent: EventEmitter<Bookmark> = new EventEmitter();
  // Editing status
  editing = false;
  uneditedBookmark: Bookmark = null;

  /**
   * Delete this bookmark
   */
  delete(): void {
      this.deleteEvent.emit(this.bookmark);
  }

  /**
   * Toggle editing of this bookmark
   */
  edit(): void {
      // Clone bookmark before editing
      this.uneditedBookmark = JSON.parse(JSON.stringify(this.bookmark));
      this.editing = true;
  }

  /**
   * Finish editing bookmark
   */
  update(bookmark: Bookmark): void {
      this.bookmark = bookmark;
      this.editing = false;
      this.updateEvent.emit(this.bookmark);
  }

  /**
   * Cancel editing this bookmark without saving changes
   */
  cancelEdit(): void {
      this.bookmark = this.uneditedBookmark;
      this.editing = false;
  }
}