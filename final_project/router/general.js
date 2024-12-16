const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;  // Use req.body for POST request
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({
        "username": username,
        "password": password
      });
      return res.status(200).json({ message: "User added successfully!" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register the user!" });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get('http://localhost:5000/books'); // Local API for getting books
    res.json(response.data); // Send the list of books as JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books list', error: error.message });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); // Local API for getting book by ISBN
    res.json(response.data); // Send the book details as JSON response
  } catch (error) {
    res.status(500).json({ message: `Error fetching details for ISBN ${req.params.isbn}`, error: error.message });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`); // Local API for getting books by author
    res.json(response.data); // Send the list of books by the author as JSON response
  } catch (error) {
    res.status(500).json({ message: `Error fetching books by author ${author}`, error: error.message });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const t = req.params.title;
  const req_key = Object.keys(books);  // Get all the keys (ISBN) in the books object
  let match_books = [];
  
  req_key.forEach(isbn => {
    const book = books[isbn];
    if (book.title === t) match_books.push(book);  // Match books by title
  });
  
  res.json(match_books);  // Return matching books
});

// Get book reviews by ISBN
public_users.get('/review/:isbn', async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/review/${isbn}`); // Local API for getting book reviews by ISBN
    res.json(response.data); // Send the book reviews as JSON response
  } catch (error) {
    res.status(500).json({ message: `Error fetching reviews for ISBN ${isbn}`, error: error.message });
  }
});

module.exports.general = public_users;
