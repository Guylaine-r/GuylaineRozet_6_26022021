const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Définition d'un schéma de données strict
const utilisateur = mongoose.Schema({
    id: { type: mongoose.Schema.ObjectId },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

utilisateur.plugin(uniqueValidator);

const model = mongoose.model("utilisateur", utilisateur);

module.exports = {
    model: model
};