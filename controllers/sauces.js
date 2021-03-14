// dossier Model sauces
const Sauce = require("../models/Sauce.js");

const fs = require('fs');


// Création d'une sauce
exports.createSauces = (request, response) => {
  let sauce = JSON.parse(request.body.sauce);
  sauce.likes = 0;
  sauce.dislikes = 0;
  sauce.usersLiked = [];
  sauce.usersDisliked = [];
  sauce.imageUrl = request.protocol + "://" + request.get("host") + "/images/" + request.file.filename;
  let sauceData = new Sauce.model(sauce);
  sauceData.save()
    .then(() => {
      response.status = 200;
      response.send({ message: "GOOD" });
    })
    .catch((error) => {
      response.status = 500;
      response.send({ error: error });
    })
};

// Récupération de toutes les sauces
exports.renvoieTableauSauces = (request, response) => {
  Sauce.model.find()
    .then(model => response.status(200).json(model))
    .catch(error => response.status(400).json({ error }));
};

// Récupération d'une seule sauce
exports.recuperationSauce = (request, response) => {
  Sauce.model.findOne({ _id: request.params.id })
    .then(model => response.status(200).json(model))
    .catch(error => response.status(400).json({ error }));
};

// Met à jour les informations d'une sauce
exports.MettreAJourSauce = async (request, response) => {
  let sauce;
  if (request.body.sauce) {
    sauce = JSON.parse(request.body.sauce);
  } else {
    sauce = request.body;
  }

  if (request.file != undefined) {
    // Pour supprimer ancienne image
    let data = await Sauce.model.findOne({ _id: request.params.id });
    //recupère les données de l'image avec la fonction split
    const filename = data.imageUrl.split('/images/')[1];
    fs.unlinkSync("./images/" + filename);
    sauce.imageUrl = request.protocol + "://" + request.get("host") + "/images/" + request.file.filename;
  };

  Sauce.model.updateOne({ _id: request.params.id }, sauce)
    .then(() => response.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => response.status(400).json({ error }));

};

// Suppression d'une sauce
exports.supprimeSauce = (request, response) => {
  Sauce.model.findOne({ _id: request.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`./images/${filename}`, () => {
        Sauce.model.deleteOne({ _id: request.params.id })
          .then(() => response.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => response.status(400).json({ error }));
      });
    })
    .catch(error => response.status(500).json({ error }));
};

// Fonction qui permet de supprimer (filtrer) certains éléments d'un tableau
const removeFromArray = (array, value) => {
  return array.filter((element) => {
    return element != value;
  });
}

// Like d'une sauce
exports.likeSauce = (request, response) => {
  let user = request.body.userId;
  Sauce.model.findOne({ _id: request.params.id })
    .then(sauce => {
      let like = request.body.like;
      if (like == 1 && !sauce.usersLiked.includes(user)) {
        sauce.likes++;
        sauce.usersLiked.push(user);
      } else if (like == -1 && !sauce.usersDisliked.includes(user)) {
        sauce.dislikes++;
        sauce.usersDisliked.push(user);
      } else if (like == 0) {
        if (sauce.usersLiked.includes(user)) {
          sauce.likes--;
          sauce.usersLiked = removeFromArray(sauce.usersLiked, user);
        }
        if (sauce.usersDisliked.includes(user)) {
          sauce.dislikes--;
          sauce.usersDisliked = removeFromArray(sauce.usersDisliked, user);
        }
      };

      Sauce.model.updateOne({ _id: request.params.id }, sauce)
        .then(() => {
          response.status = 200;
          response.send({ message: "GOOD !" });
        })
        .catch((error) => {
          console.log(error)
          response.status = 500;
          response.send({ message: "BAD !" });
        })
    });
};
