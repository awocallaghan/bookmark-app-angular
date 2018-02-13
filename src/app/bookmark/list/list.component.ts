/**
 * BookmarkListComponent
 * - List paginated bookmarks on overview page
 * - Get page from route params
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { BookmarkService } from './../../services/bookmark.service';
import { Bookmark } from './../../models/bookmark';

@Component({
  selector: 'app-bookmark-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class BookmarkListComponent implements OnInit {
  // Current page number
  page = 0;
  // Array of bookmarks on current page
  bookmarks: Bookmark[] = [];
  // Total number of bookmarks
  total: number;
  // Total page count
  pages: number[];

  constructor(
    private bookmarkService: BookmarkService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Load data on initialisation
   */
  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.page = params.hasOwnProperty('page') ? parseInt(params['page'], null) || 0 : 0;
      this.refresh();
    });
  }

  /**
   * Reload bookmarks + pages
   */
  refresh(): void {
    // Create array of page numbers so we can loop with *ngFor
    this.pages = new Array(this.bookmarkService.getPageCount())
      .fill(null)
      .map((v, i) => i);
    // Ensure page is not greater than max page count
    if (this.page >= this.pages.length) {
      this.page = this.pages.length - 1;
    }
    // Get the bookmarks data
    this.bookmarks = this.bookmarkService.getAll(this.page);
    // Get total count of bookmarks
    this.total = this.bookmarkService.getTotalCount();
  }

  /**
   * Change the current page
   * @param page - page to change to
   */
  setPage(page: number): void {
    this.router.navigate([this.page]);
  }

  /**
   * Delete a bookmark
   * @param bookmark - bookmark to delete
   */
  delete(bookmark: Bookmark): void {
    const success = this.bookmarkService.remove(bookmark);
    if (success) {
      // Reload data
      this.refresh();
    }
  }

  /**
   * Update a bookmark
   * @param bookmark - bookmark to update
   */
  update(bookmark: Bookmark): void {
    // Reload data
    this.refresh();
  }
}
