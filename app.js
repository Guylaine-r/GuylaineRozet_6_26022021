// Importations
const ENVIRONMENT = require("./env/env.json");
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require("path");
const cors = require('cors'); 
const multer = require("./middleware/multer-config.js");
const saucesRoutes = require('./routes/sauces')
const userRoutes = require('./routes/user')
const fs = require("fs"); 

//Intall plugin => Gère les debits, utiliser pour limiter des demandes répétées aux API 
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 1000 * 60,
  max: 100
});

// Install plugin => HELMET permet de sécuriser les app Express en définissant divers en-têtes HTTP
const helmet = require("helmet");

const app = express(); 
app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use('/images/', express.static(path.join(__dirname, 'images'))); 
app.use('/api/', saucesRoutes);
app.use('/api/', userRoutes);
app.use(helmet());
app.use(limiter);

mongoose.connect(ENVIRONMENT.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); // Connexion à la BDD avec les paramètres recommendés

app.listen(3000, () => {
  console.log("Server started...");
})