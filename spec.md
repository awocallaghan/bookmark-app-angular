# App brief

Develop a JavaScript web app that maintains a list of bookmarks (links). The user is able to add/edit/delete any link in the list.  The application should only use front-end technologies (ie no backend database!).

# Flow

- Overview page 
    - Displays a form on the top of the page that lets a user submit a link. The form should validate whether the input is a valid URL and exists.
    - Displays the a list of links with pagination so 20 links are shown per page. 
    - The pagination should include numbered pagination with next and previous links eg. < 1 2 3 >.
- Results page
    - Contains a message thanking the user for a submission.
    - Displays the user’s submission.
    - Includes a link back to the overview page.

# Technologies to use

- Basic layout (HTML/CSS).
- Pure JavaScript (although if AngularJS is permissible if you want want to use a framework).

# Deliverables

Form validation must be custom written.
All links entered in the list must persist page reload.
Where applicable, all code should follow the Google style guidelines.
All code should be commented.
The application should be accompanied by a brief TDD (Technical Design Document) outlining the solution’s design and any limitations.
Source code to be linked to a repository (private or public).
A public link to the final app.
Feel free to add any additional features that further demonstrates your skills.

# Bonus points

All JavaScript should be compiled into a single minified file using the Google Closure Compiler (using the command line compiler) with advanced optimisations. 
