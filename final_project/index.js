const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"thebooksonthetable",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const token = req.headers['authorization'];

    if (!token) 
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó un token."});

    try {
            const decoded = jwt.verify(token.split(' ')[1], 'thebooksonthetable');

            req.user = decoded;
    
            next();
        } catch (ex) {
            return res.status(401).json({ message: "Token inválido o expirado." });
        }

});
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
