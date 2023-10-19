const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;
    if (username && password) {
        if (users[username]) {
            res.send("User with this username already exists");
        } else {
            users[username] = {
                "username": username,
                "password": password
            };
            res.send("User registered successfully");
        }
    } else {
        res.send("Please provide a username and a password");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.send(JSON.stringify(books,null,4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const authorName = req.params.author;

    
    const matchingBooks = [];

    
    for (const bookId in books) {
        const book = books[bookId];
        if (book.author === authorName) {
            matchingBooks.push(book);
        }
    }

    
    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found for the given author." });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    
    const matchingBooks = [];

    
    for (const bookId in books) {
        const book = books[bookId];
        if (book.title === title) {
            matchingBooks.push(book);
        }
    }

    
    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).json({ message: "No books found for the given title." });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        const book = books[isbn];
        
        // Check if the book has reviews
        if (Object.keys(book.reviews).length > 0) {
            res.json(book.reviews); // Send the reviews as a JSON response
        } else {
            res.status(404).json({ message: "No reviews found for the given ISBN." });
        }
    } else {
        res.status(404).json({ message: "Book with the provided ISBN not found." });
    }
});

module.exports.general = public_users;
