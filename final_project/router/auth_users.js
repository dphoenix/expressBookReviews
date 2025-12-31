const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
let validUsers = users.filter((user) => {
  return useInsertionEffect.username === username;
})
return validUsers.length > 0;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  //console.log("users length: " + users.length)
  let validUsers = users.filter((user) => {
    return user.username === username && user.password === password;
  });
  return validUsers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password){
    return res.status(404).json({ message: "Error logging in" });
  }

  if(authenticatedUser(username, password)){
    let accessToken = jwt.sign({
      data: password
    }, 'access', {expiresIn: 60 * 600 });

    req.session.authorization = {
      accessToken, username
    };
    return res.status(200).send("Customer successfully logged in");
  } else{
    return res.status(200).json({ message: "Invalid login. Check username and password."});
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  let isbn = req.params.isbn;
  let book = books[isbn];
  let username = req.session.authorization.username;

  if(!book){
    return res.status(200).json({ message: "Error. No such ISBN found"});
  }

  delete book.reviews[username]

  res.send(`Reviews for the ISBN ${isbn} posted by the user ${username} deleted.`)
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;
  let book = books[isbn];
  let username = req.session.authorization.username
  let reviewText = req.query.review

  if(!book){
    return res.status(200).json({ message: "Error. No such ISBN found"});
  }
  // Check book reviews
  let reviewsArray = Object.values(book.reviews)
  let existingReview = reviewsArray.filter((review) => {
    if(review.username === username){
      review.review = reviewText
      books.reviews[username] = reviewText
      return review;
    }
  })

  if(existingReview.length === 0){
    book.reviews[username] = reviewText;
  }

  return res.status(200).json({message: "The review for the book with ISBN " + isbn + " has been aded/updated"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
