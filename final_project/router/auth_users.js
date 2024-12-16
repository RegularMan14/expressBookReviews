const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session')
const regd_users = express.Router();

let users = [];

// Check if a user with the given username already exists
const isValid = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user) => {return (user.username === username)&&(user.password === password)});
  if(validusers.length > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.query.username;
  const password = req.query.password;

  if(!username || !password)
    {
      return res.status(404).json({message: "Error logging in"})
    }

  if(authenticatedUser(username, password))
    {
      const accessToken = jwt.sign({data: password}, 'access', {expiresIn: 60*60});
      req.session.authorization = {accessToken, username};
      console.log(req.session.authorization);  // Log session data

      return res.status(200).send("User successfully logged in");
    }
    else
    {
      return res.status(400).json({message:"Invalid login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) =>
  {
    const isbn = req.params.isbn;
    const selected_book = books[isbn];
    const username = req.session.authorization.username; // Get the username from session

    // Ensure the user is logged in and the review is not empty
    if (!username) {
      return res.status(403).json({ message: "User not authenticated" });
    }

    if (!review) {
      return res.status(400).json({ message: "Review cannot be empty" });
    }

    // Check if the ISBN exists in the books database
    if (!selected_book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if the user already has a review for this book
    if (selected_book.reviews[username]) {
      // Modify the existing review
      selected_book.reviews[username].comment = review;
      return res.status(200).json({ message: "Review updated successfully" });
    } else {
      // Add a new review for this ISBN by the user
      selected_book.reviews[username] = {
        reviewer: username,
        rating: 5, // Default rating can be added, or you can pass it in the request as well
        comment: review
      };
      return res.status(200).json({ message: "Review added successfully" });
    }
  });

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
