# TinyApp Project

## Description
TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). This is my first project built from the ground-up witht little assistance from the Lighthouse mentors and instructors.

The project allows users to not only shorten the links but also edit and delete the existing links as long they are registered and signed-in to their account. 

## About the Project
* URLs are saved in the database to be accessed by user upon logged-in.
* Users are require to register in order to access the URL shortner, edit and delete the existing URLs.
* Users' passwords are hashed and not saved in plain text.
* Users' ID's are encrypted.


## Final Product

!["The main login view of the web application."](https://github.com/dreamb0yDani/tinyapp/blob/master/docs/login_view.png?raw=true)

!["The url list view"](https://github.com/dreamb0yDani/tinyapp/blob/master/docs/url_list_view.png?raw=true)

!["The edit view of the links"](https://github.com/dreamb0yDani/tinyapp/blob/master/docs/edit_view.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session
- morgan

## Getting Started

>Install all dependencies 
```
npm install
```
>Run the development web server using the
```
node express_server.js
```
