const jwt = require("jsonwebtoken");
const fs = require("fs");

module.exports = (request, response, next) => {
    try{
        const token = request.headers.authorization.split(' ')[1]; // Récupération du token de l'utilisateur
        const key = fs.readFileSync("./secure/jwt_key.pub");
        const decodedToken = jwt.verify(token, key, {algorithms: ['RS256']});// Décodage du token
        const userId = decodedToken.userId;
        if(request.body.userId && request.body.userId !== userId) { // Vérification de la correspondance
            throw 'User Id non valable !';
        }else {
            next();
        }
    } catch(error) {
        console.error(error);
        response.status(401).json({error: error | 'requête non authentifié !'});
    }
};