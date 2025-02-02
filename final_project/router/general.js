const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Verificar si el usuario ya existe
    if (users.find(user => user.username === username)) {
      return res.status(400).json({ message: "El usuario ya existe." });
    }
  
    // Validar el nombre de usuario y la contraseña
    if (!isValid(username)) {
      return res.status(400).json({ message: "Nombre de usuario no válido." });
    }
  
    // Registrar el nuevo usuario
    users.push({ username, password });
  
    return res.status(200).json({ message: "Usuario registrado con éxito." });
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json({...books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Obtener el parámetro `isbn` de la URL
    const book = books[isbn]; 
  return res.status(200).json({...book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const book = Object.values(books).filter(b => b.author===author); 
  return res.status(200).json({...book});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const book = Object.values(books).filter(b => b.title===title); 
  return res.status(200).json({...book});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]['reviews']; 
  return res.status(200).json({...book});
});

module.exports.general = public_users;
