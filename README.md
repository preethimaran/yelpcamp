# YelpCamp 
YelpCamp is a definitive Fullstack Web Application built using Node.js, Express, MongoDB and Bootstrap to mimic the functionality of the review platform Yelp. Users can register to create campgrounds and users who are logged in can leave reviews for the created campgrounds. This project was built as part of [@Colt Steele](https://github.com/Colt)'s The Web Developer's Bootcamp 2026. The aim of this project is to demonstrate an understanding of fullstack web development and how the different components: frontend, authentication, backened and a database are integrated to create a fully functioning app for a seemless user experience.

## Overview of YelpCamp functionality
* In YelpCamp to create a campground a user will first have to register themselves by providing a username, email and password.
* A user stays logged in after registration.
* A user can log in by entering their username and password.
* A logged in user stays logged in for a week if they do not manually logout.
* Only a logged in creator of a campground can modify the information of the campground or delete the specific campground.
* To leave reviews on campgrounds a user will have to be logged in.
* A logged in user can delete their own reviews.
* A user that is not logged in can browse through all the available campgrounds and read all the reviews but cannot perform any other action.

## Tech Stack Used
* **Node.js** *Javascript Run Time Environment.*
* **Express.js** *Web Application Framework for creating a server and handling HTTP requests.*
* **EJS** *Templating Engine.*
* **Passport.js** *For Authentication and Authorisation of users.*
* **MongoDB and MongoDB Atlas**: *NoSQL database.*
* **Mongoose** *MongoDB Object Data Modelling (ODM) library to create connection between MongoDB (Atlas) and Node.js*
* **Helmet.js** *For security by setting Content Security Policy header in HTTP response.*






[Live Demo](https://yelpcamp-seven-kappa.vercel.app/)
