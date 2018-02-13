/**
 * ResultsComponent
 * - Component for the results page to show an added bookmark's details (BookmarkItemComponent)
 */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BookmarkService } from '../services/bookmark.service';
import { Bookmark } from '../models/bookmark';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  bookmark: Bookmark = null;

  constructor(
    private bookmarkService: BookmarkService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      const id = params['id'];
      this.bookmark = this.bookmarkService.get(id).bookmark;
    });
  }
}