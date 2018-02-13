# Technical Design Document

I decided to use Angular to develop the bookmark web app. 

# BookmarkService

I created a injectable service for storing the bookmarks as well as a model interface for the data structure (app/models/bookmark.ts). In order to persist data on page reload I decided to use the [localStorage]() API to store the array of bookmark objects as a JSON string. The internal private method `save` stringifies and stores the bookmarks. In the constructor any saved bookmarks are loaded from localStorage.

To allow adding, editing, and deleting links I defined three methods `add`, `update` and `remove`. After altering the bookmarks array each method calls `save`.

Also in order to ensure the URL exists I created a `validate` function to be used by `add` and `update`. `validate` generates a unique `id` using the url and the `uuid/v3` npm module and checks that there is no existing bookmark with that id (and url). To validate the URL exists a GET request is made to the url (which will work for local or CORS-enabled sites) and then a CORS proxy https://cors-anywhere.herokuapp.com/ to avoid CORS errors. Due to the async operation of HTTP requests `add`, `update`, and `validate` return rxjs Observables.

The method `getAll` takes a page number argument and slices the bookmarks array to support pagination. `get` allows getting a single bookmark by its id.

# Components

AppComponent - header + router-outlet

OverviewComponent (overview page: /overview/:page)
-   BookmarkAddComponent
    - BookmarkFormComponent
-   BookmarkListComponent
    - BookmarkEditItemComponent (extends BookmarkItemComponent)
        - BookmarkFormComponent

ResultsComponent (results page: /result/:id)
-   BookmarkItemComponent

## URL validation

BookmarkFormComponent (app/bookmark/form) validates the URL format using a regular expression pattern (there may be some weird character edge cases that require altering of the RegEx).