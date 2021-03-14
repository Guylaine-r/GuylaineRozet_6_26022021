//clés : JWT permet d'échanger des informations de manière sécurisé => preuve d'authentification
const ENVIRONMENT = require("../env/env.json");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");

// dossier Model utilisateur
const User = require('../models/User');

// Inscription
exports.signup = (request, response) => {
    // Email
    if (!request.body.email) {
        response.statusCode = 500;
        response.send({ message: "Email missing" });
        return;
    }
    let email = request.body.email;

    // Password
    if (!request.body.password) {
        response.statusCode = 500;
        response.send({ message: "Password missing" });
        return;
    }
    let password = bcrypt.hashSync(request.body.password, ENVIRONMENT.SALT);

    let user = new User.model({
        email: email,
        password: password
    });
    // Ajout de l'utilisateur créé dans la base de donnée
    user.save()
        .then(() => {
            response.statusCode = 200;
            response.send({
                message: "GOOD"
            });
        })
        .catch(() => {
            response.statusCode = 403;
            response.send({
                message: "Problème avec la BDD ou email déjà utilisé"
            });
        })
};

// Connexion
exports.login = (request, response) => {
    let email = request.body.email;
    let password = request.body.password;

    User.model.findOne({ email: email })
        .then((user) => {
            if (bcrypt.compareSync(password, user.password)) {
                let key = fs.readFileSync("./secure/jwt_key");
                let token = jwt.sign({ userId: user._id }, key, {expiresIn: '24h', algorithm: 'RS256'})
                response.statusCode = 200;
                response.send({
                    userId: user._id,
                    token: token
                });
            } else {
                response.statusCode = 403;
                response.send({ message: "Mauvaise combinaison email/mot de passe" })
            }
        })
        .catch((error) => {
            console.error(error);
            response.statusCode = 403;
            response.send({ message: "Mauvaise combinaison email/mot de passe" })
        })
};