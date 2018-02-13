/**
 * Manage saved bookmark links
 * - Persist data on page refresh by using localStorage
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/observable';
import * as uuid from 'uuid/v3';

import { Bookmark } from './../models/bookmark';

// Constant key for storing bookmarks
const STORAGE_KEY = 'bookmarks-app-storage';
// Number of links per page
const PAGE_SIZE = 20;
// Interface for Bookmark result
interface BookmarkResult {
  index: number;
  bookmark: Bookmark;
}

@Injectable()
export class BookmarkService {
  // Storage API reference
  storage: Storage = window.localStorage;
  // Saved bookmarks
  bookmarks: Bookmark[] = [];

  constructor(private http: HttpClient) {
    // Attempt to load bookmarks from local storage
    const bookmarkData: string = this.storage.getItem(STORAGE_KEY);
    if (bookmarkData != null && bookmarkData.length > 0) {
      try {
        // Parse bookmarks JSON array
        this.bookmarks = JSON.parse(bookmarkData) as Bookmark[];
      } catch (error) {
        console.error('Error parsing bookmarks JSON', error);
      }
    }
  }

  /**
   * Save array of bookmarks to local storage
   */
  private save(): void {
    // Convert array to JSON string
    const bookmarkData: string = JSON.stringify(this.bookmarks);
    // Store in local storage
    this.storage.setItem(STORAGE_KEY, bookmarkData);
  }

  /**
   * Get the total amount of bookmarks
   * @returns {number} - total number of bookmarks
   */
  getTotalCount(): number {
    return this.bookmarks.length;
  }

  /**
   * Get array of bookmarks
   * @param {number} - page number of bookmarks to get
   * @returns {Bookmark[]} - array of bookmarks on given page
   */
  getAll(page: number): Bookmark[] {
    const start = page * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    return this.bookmarks
      .slice(start, end)
      // Return copies not reference to original
      .map(bookmark => JSON.parse(JSON.stringify(bookmark)));
  }

  /**
   * Get a single bookmark by id
   * @param {number} - bookmark id
   * @returns {BookmarkResult} - bookmark with given id and index
   */
  get(id: number): BookmarkResult {
    for (let i = 0; i < this.bookmarks.length; i++) {
      if (this.bookmarks[i].id === id) {
        return {
          index: i,
          // Return a copy of the bookmark (by value not reference)
          bookmark: JSON.parse(JSON.stringify(this.bookmarks[i]))
        };
      }
    }
    return null;
  }

  /**
   * Get page count
   * @returns {number} - number of pages
   */
  getPageCount(): number {
    return Math.ceil(this.bookmarks.length / PAGE_SIZE);
  }

  /**
   * Validate a bookmark
   * - Bookmark URL should be unique
   * - Bookmark URL should exist
   * @param bookmark - bookmark to validate
   * @returns {Observable<Bookmark>} - valid bookmark
   */
  private validate(bookmark: Bookmark): Observable<Bookmark> {
    return new Observable<Bookmark>(subscriber => {
      // Generate UUID for URL
      const id = uuid(bookmark.protocol + bookmark.url, uuid.URL);
      // Try find existing bookmark with matching uuid
      const existingBookmark = this.get(id);
      // Don't add duplicate URLs
      if (existingBookmark !== null) {
        subscriber.error('Bookmark with given URL already exists');
        return subscriber.complete();
      }
      // Attach id to bookmark
      bookmark.id = id;
      // Check URL exists by trying to request it
      this.http
        .get(
          bookmark.protocol + bookmark.url,
          // Don't expect JSON
          { responseType: 'text' }
        )
        .subscribe(
          data => {
            // Response: URL exists
            // Return the valid bookmark
            subscriber.next(bookmark);
            subscriber.complete();
          },
          err => {
            // Request failed: maybe because of CORS?
            // - Try to request via CORS proxy
            this.http
              .get(
                'https://cors-anywhere.herokuapp.com/' + bookmark.protocol + bookmark.url,
                // Don't expect JSON
                { responseType: 'text' }
              )
              .subscribe(
                data => {
                  // Response: URL exists
                  // Return the valid bookmark
                  subscriber.next(bookmark);
                  subscriber.complete();
                },
                error => {
                  // Request failed again: URL must not exist or connection problem
                  subscriber.error('URL not found');
                  subscriber.complete();
                }
              );
            }
          );
    });
  }

  /**
   * Add a new bookmark
   * @param bookmark - new Bookmark to be added
   * @returns {Bookmark} - added bookmark
   */
  add(bookmark: Bookmark): Observable<Bookmark> {
    return new Observable<Bookmark>(subscriber => {
      this.validate(bookmark)
        .subscribe(
          validatedBookmark => {
            this.addBookmark(validatedBookmark);
            subscriber.next(validatedBookmark);
            subscriber.complete();
          },
          err => {
            subscriber.error(err);
            subscriber.complete();
          }
        );
    });
  }

  private addBookmark(bookmark: Bookmark): Bookmark {
    // Add to array of bookmarks
    this.bookmarks.push(bookmark);
    // Save to local storage
    this.save();
    return bookmark;
  }

  /**
   * Remove a bookmark
   * @param bookmark - existing Bookmark to be removed
   * @returns {boolean} - success
   */
  remove(bookmark: Bookmark): boolean {
    // Find index of given bookmark in array
    const index: number = this.get(bookmark.id).index;
    if (index >= 0) {
      // Remove bookmark and save changes
      this.bookmarks.splice(index, 1);
      // Save changes to local storage
      this.save();
      return true;
    }
    return false;
  }

  /**
   * Update a bookmark
   * @param id - index + 1 of bookmark in array
   * @param bookmark - new bookmark data
   * @returns {Observable<Bookmark>} - resolves updated bookmark
   */
  update(id: number, bookmark: Bookmark): Observable<Bookmark> {
    return new Observable<Bookmark>(subscriber => {
      // Check bookmark exists
      const savedBookmark: BookmarkResult = this.get(id);
      if (savedBookmark === null) {
        subscriber.error('Bookmark not found');
        return subscriber.complete();
      }
      // Check bookmark has actually been changed
      console.log(bookmark, savedBookmark.bookmark);
      if (
          bookmark.protocol === savedBookmark.bookmark.protocol &&
          bookmark.url === savedBookmark.bookmark.url
      ) {
          subscriber.next(bookmark);
          return subscriber.complete();
      }
      this.validate(bookmark)
          .subscribe(
              validatedBookmark => {
                  // Update bookmark
                  this.bookmarks[savedBookmark.index] = validatedBookmark;
                  // Save changes to local storage
                  this.save();
                  // Resolve updated bookmark
                  subscriber.next(validatedBookmark);
                  subscriber.complete();
              },
              err => {
                  subscriber.error(err);
                  subscriber.complete();
              }
          );
    });
  }
}
