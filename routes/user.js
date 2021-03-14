const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');

// Chriffre le password de l'user et ajoute l'user à la base de données
router.post('/auth/signup', userCtrl.signup);

// Vérifie les informations d'identification de l'utilisateur. 
// renvoie l'identifiant UserId depuis de la base de donnéees
// renvoie un jeton (JWT) signé => contenant également l'ID  userId
router.post('/auth/login', userCtrl.login);

module.exports = router; 