import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { OverviewComponent } from './overview/overview.component';
import { ResultsComponent } from './results/results.component';
import { BookmarkAddComponent } from './bookmark/add/add.component';
import { BookmarkListComponent } from './bookmark/list/list.component';
import { BookmarkItemComponent } from './bookmark/item/item.component';
import { BookmarkEditItemComponent } from './bookmark/edit-item/edit-item.component';
import { BookmarkFormComponent } from './bookmark/form/form.component';

import { AppRoutingModule } from './app-routing.module';

import { BookmarkService } from './services/bookmark.service';

@NgModule({
  declarations: [
    AppComponent,
    OverviewComponent,
    ResultsComponent,
    BookmarkAddComponent,
    BookmarkListComponent,
    BookmarkItemComponent,
    BookmarkEditItemComponent,
    BookmarkFormComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [ BookmarkService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
