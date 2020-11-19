Final Project Submission for CS50's Web Programming with Python and Javascript Course

The website is called Thoughtful. It's purpose is to provide a place for people to explore different questions on their own, and see what conclusions they come to. The javascript UI allows users to create questions, and respond with arguments for or against that question. They can then respond to their arguments, creating a tree. A user can establish whether a response is for or against, and show how significant that response is by placing it a certain distance down the divider line. The hope is that user's might get a chance to become more educated on hard topics and come to their own conclusions rather than accepting what others say, and learn from others who have already done the work.

On the surface, this website is not much more complex in its structure from a social media site. What makes this project more complex than previous one's is its detailed UI, allowing users to design trees of data with ease. Adding an element to your tree is as easy as clicking and dragging, traversing is a simple double click, and deleting is just the delete key. If you want to traverse backwards or save your work, the sidebar pulls out easily. Your work is also saved any time you traverse, making for a comfortable, safe work experience. Smaller devices lose minimal accessability, and a great deal more attention to the aesthetic of this project was given as well. In short, the detail that went into the front end of this project and the connectivity from the complex front end to the back end are what makes this project more complex than all previous projects and deserving of a passing grade.

In this web application, I wrote every file in the folders static/writer and templates/writer, and I significantly added to admin.py, models.py, urls.py and views.py.

The layout pages were layout.html and login_layout.html. 
- Layout.html provided the navigation bar at the top of the screen on most pages (all except login and register), and login_layout.html was the layout for pages with a centered box for the content with a background design (used on the login and register pages). 
- Login_layout.html utilized login_layout.js, which organized the images in the background and centered the content box.

The webpages were explore.html, index.html, login.html, register.html, and writer.html. 
- Explore.html displayed any page with a list of thoughts or questions, including the list of recent thoughts, the list of popular questions, and users' profiles. It utilized explore.js to help with deleting thoughts on a user's own page. 
- Index.html displayed the welcome screen, prompting a user to start a thought or continue one, and redirecting the user to the register page if they do not already have an account. To have a box similar to the login and register page, this file utilized the login_layout.js file. It also utilized index.js, which helped with changing the page's display when starting a new thought.
- Login.html displayed the login page. It utilized login.js for sending error messages when a bad username password combo was entered.
- Register.html displayed the register page. It utilized register.js for error messages and for sending the new account data to the database
- Writer.html displayed the UI for creating and traversing thoughts. It utilized writer.js and viewer.js depending on whether or not the user was traversing their own thought. Writer.js allowed for traversing, creating, editing, and deleting arguments, and saving the thought, whereas viewer.js only allowed for traversing.

The python files I edited were admin.py, models.py, urls.py, and views.py.
- Admin.py was simply to help me look into what was being stored in the database.
- Models.py was where I wrote all of the models used in this project; User, Thought, Argument and Question. This helped create the tree-like structure of arguments in thoughts.
- Urls.py was where all of the web paths were stored
- Views.py was where calls to urls were handled, including links to new webpages, additions, edits and deletions to the database, and logging in and out of the site.