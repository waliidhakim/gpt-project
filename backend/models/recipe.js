const mongoose = require('mongoose');


const recpieSchema = new mongoose.Schema({
    title: String,
    description: String,
    ingredients: [String],
    steps: [String],
    image: String,
    rating: {
        type : Number,
        default : 0
    },
    reviews: [{ // Chaque avis aura désormais son propre score
        user: String,
        comment: String,
        rating: Number, // Ajout d'une note individuelle pour chaque avis
        date: { 
          type: Date, 
          default: Date.now // Définit la date actuelle par défaut
        }
      }]
})


module.exports = mongoose.model("Recipe", recpieSchema);

