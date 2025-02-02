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
public_users.get('/', function (req, res) {
    getBookList()
        .then(bookList => {
            return res.status(200).json(bookList); 
        })
        .catch(error => {
            return res.status(500).json({ error: error.message });
        });
});

function getBookList() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books) {
                resolve({ ...books }); 
            } else {
                reject(new Error('No se pudo obtener la lista de libros')); 
            }
        }, 6000);
    });
}

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn; // Obtener el parámetro `isbn` de la URL

    getBookDetailsByISBN(isbn)
        .then(bookDetails => {
            return res.status(200).json(bookDetails); // Enviamos la respuesta con los detalles del libro
        })
        .catch(error => {
            return res.status(500).json({ error: error.message }); // Manejamos el error
        });
});

// Función para obtener los detalles del libro usando Promesas
function getBookDetailsByISBN(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const book = books[isbn];
            if (book) {
                resolve({ ...book });
            } else {
                reject(new Error('Libro no encontrado')); 
            }
        }, 2000); 
    });
}
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author; 

    getBooksByAuthor(author)
        .then(booksByAuthor => {
            return res.status(200).json(booksByAuthor); 
        })
        .catch(error => {
            return res.status(500).json({ error: error.message }); 
        });
});

// Función para obtener los libros de un autor usando Promesas
function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const booksByAuthor = Object.values(books).filter(b => b.author === author); 
            if (booksByAuthor.length > 0) {
                resolve(booksByAuthor); 
            } else {
                reject(new Error('No se encontraron libros del autor especificado')); 
            }
        }, 2000); 
    });
}


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title; 

    getBooksByTitle(title)
        .then(booksByTitle => {
            return res.status(200).json(booksByTitle);
        })
        .catch(error => {
            return res.status(500).json({ error: error.message });
        });
});

// Función para obtener los libros por título usando Promesas
function getBooksByTitle(title) {
    return new Promise((resolve, reject) => {
       
        setTimeout(() => {
            const booksByTitle = Object.values(books).filter(b => b.title === title); 
            if (booksByTitle.length > 0) {
                resolve(booksByTitle);
            } else {
                reject(new Error('No se encontraron libros con el título especificado')); // Rechazamos la Promesa si no hay libros
            }
        }, 2000); 
    });
}

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn]['reviews']; 
  return res.status(200).json({...book});
});

module.exports.general = public_users;
