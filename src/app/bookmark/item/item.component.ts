/**
 * BookmarkItemComponent
 * - Show a bookmark without allowing editing/deleting (used on results page after creation)
 */
import { Component, Input } from '@angular/core';

import { Bookmark } from '../../models/bookmark';

@Component({
    selector: 'app-bookmark-item',
    templateUrl: './item.component.html',
    styleUrls: ['./item.component.css']
})
export class BookmarkItemComponent {
    @Input() bookmark: Bookmark;
}
