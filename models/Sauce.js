const mongoose = require('mongoose');

// Définition d'un schéma de données strict
const sauceSchema = mongoose.Schema({
  id: { type: mongoose.Schema.ObjectId },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number, required: true },
  dislikes: { type: Number, required: true },
  usersLiked: { type: [{type: "String"}], required: true },
  usersDisliked: { type: [{type: "String"}], required: true },
})

const model = mongoose.model("sauce", sauceSchema);

module.exports = {
  model: model
};