const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.query.username;
  let password = req.query.password;

  let existingUsers = users.filter((user) => {
    return (user.username == username)
  })
  
  if(existingUsers.length > 0){
    return res.status(500).json({message: "Error: A user with this username already exists"});
  }

  if(username === undefined || password === undefined){
    return res.status(500).json({message: "Error: You have attempted to create a user without a username or a password. Username: "})
  }

  let newUser = {
    username: username,
    password: password
  }

  users.push(newUser)
  res.send("Customer successfully registered.  You can now login");

  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Task 10: Get the book list, using async/await
public_users.get('/async', async function (req, res){
  // Note: I also had to install axios, and require/import at the start of the file
  try{
    const response = await axios.get('http://localhost:5000');
    res.status(200).json(response.data)
  }catch(err){
    res.status(500).json({ message: "Error fetching book list", error: err.message });
  }
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let matchingBooks = books[isbn]
  res.send(JSON.stringify(matchingBooks, null, 4))
  //return res.status(300).json({message: "Yet to be implemented"});
 });

 // Task 11: Get the book details based on ISBN, using async/await
 public_users.get('/isbn_async/:isbn', async function(req, res){
  try{
    let isbn = req.params.isbn
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    res.status(200).json(response.data)
  }catch(err){
    res.status(500).json({ message: "Error fetching book details", error: err.message });
  }
 })
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let booksArray = Object.values(books)
  let matchingBooks = booksArray.filter((book) => {return book.author === author});
  res.send(JSON.stringify(matchingBooks, null, 4))
  //return res.status(300).json({message: "Yet to be implemented"});

});

// Task 12: Get book details based on author, with promise and callback
public_users.get('/author_promise/:author', function (req, res) {
  let author = req.params.author;

  const promise = new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/author/${author}`)
    .then(response => resolve(response.data))
    .catch(err => reject(err))
  });

  promise
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({ message: "Author not found", error: err.mesage}));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let booksArray = Object.values(books);
  let matchingBooks = booksArray.filter((book) => {return book.title === title}); 
  res.send(JSON.stringify(matchingBooks, null, 4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Task 13: Get all books based on title, with promise and callback
public_users.get('/title_promise/:title', function (req, res) {
  let title = req.params.title;

  const promise = new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/title/${title}`)
    .then(response => resolve(response.data))
    .catch(err => reject(err))
  });

  promise
  .then(data => res.status(200).json(data))
  .catch(err => res.status(404).json({ message: "Title not found", error: err.mesage}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let matchingBook = books[isbn];
  res.send(JSON.stringify(matchingBook.reviews, null, 4))
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
