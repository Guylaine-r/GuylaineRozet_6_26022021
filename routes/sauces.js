const express = require('express');
const router = express.Router();
const routesCtrl = require('../controllers/sauces');
const auth = require('../middleware/auth');


//recupération fichiers Multer => Pour que les Users téléchargent des images 
const multer = require("../middleware/multer-config.js");

// enregistre et capture l'image
// analyse la sauce en utilisant une chaine de caractères et l'enregistre dans la base de données en definissant l'imageURL
// remet les sauces liké et disliké à 0
// remet les sauces Userliked et Userdislikes en tableau vide => []
router.post("/sauces", auth, multer, routesCtrl.createSauces);

// définit le status "j'aime"/"je n'aime pas" pour userID fourni
router.post('/sauces/:id/like', auth, routesCtrl.likeSauce); 

//renvoie le tableau de toutes les sauces dans la base de donées
router.get("/sauces", auth, routesCtrl.renvoieTableauSauces);

// Récupère la sauce avec l'ID fourni
router.get("/sauces/:id", auth, routesCtrl.recuperationSauce);

// mettre à jour la sauce avec l'identifiant fourni
router.put('/sauces/:id', auth, multer, routesCtrl.MettreAJourSauce);

// supprime la sauce avec l'identifiant  fourni
router.delete('/sauces/:id', auth, routesCtrl.supprimeSauce);

module.exports = router;