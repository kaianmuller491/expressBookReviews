const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
return true;
}

const authenticatedUser = (username, password) => {
    // Verificar si el usuario existe y la contraseña coincide
    return users.some(
      (user) => user.username === username && user.password === password
    );
  };

//only registered users can login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Verificar si se proporcionaron nombre de usuario y contraseña
    if (!username || !password) {
      return res.status(400).json({ message: "Nombre de usuario y contraseña son requeridos." });
    }
  
    // Verificar si el usuario está autenticado
    if (!authenticatedUser(username, password)) {
      return res.status(401).json({ message: "Nombre de usuario o contraseña incorrectos." });
    }
  
    // Generar un token JWT
    const token = jwt.sign(
      { username }, // Payload (datos que quieres incluir en el token)
      "thebooksonthetable", // Clave secreta para firmar el token
      { expiresIn: "1h" } // El token expira en 1 hora
    );
  
    // Devolver el token al cliente
    return res.status(200).json({ message: "Inicio de sesión exitoso.", token });
  });

  regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Obtener el ISBN del libro desde los parámetros de la URL
    const { review } = req.query; // Obtener la reseña desde la consulta de la solicitud
    const username = req.user.username; // Obtener el nombre de usuario del token JWT
  
    // Verificar si el libro existe
    if (!books[isbn]) {
      return res.status(404).json({ message: "Libro no encontrado." });
    }
  
    // Inicializar el objeto de reseñas si no existe
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }
  
    // Agregar o modificar la reseña del usuario
    books[isbn].reviews[username] = review;
  
    return res.status(200).json({ message: "Reseña agregada/modificada con éxito." });
  });

  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params; // Obtener el ISBN del libro desde los parámetros de la URL
    const username = req.user.username; // Obtener el nombre de usuario del token JWT
  
    // Verificar si el libro existe
    if (!books[isbn]) {
      return res.status(404).json({ message: "Libro no encontrado." });
    }
  
    // Verificar si el libro tiene reseñas
    if (!books[isbn].reviews) {
      return res.status(404).json({ message: "No hay reseñas para este libro." });
    }
  
    // Verificar si el usuario tiene una reseña para este libro
    if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "No tienes una reseña para este libro." });
    }
  
    // Eliminar la reseña del usuario
    delete books[isbn].reviews[username];
  
    return res.status(200).json({ message: "Reseña eliminada con éxito." });
  });


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
