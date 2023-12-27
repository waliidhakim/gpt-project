const Recipe = require('./../models/recipe');

// GET /recipes
const getRecipes =  async (req, res) => {
        console.log("get all recipe endpoint");
        try {
            const recipes = await Recipe.find();
            res.json({
                message : "success",
                count : recipes.length,
                recipes
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }

// GET /recipes/:id
const getRecipeById = async (req, res) => {
    res.status(200).json(
        {   
            message : "success",
            recipe : res.recipe
            
        });
};

// POST /recipes
const createOneRecipe =  async (req, res) => {
    const recipe = new Recipe({
        title: req.body.title,
        description: req.body.description,
        ingredients : req.body.ingredients,
        steps : req.body.steps,
        image : req.body.image,
        rating : req.body.rating,
    });

    try {
        const newRecipe = await recipe.save();
        res.status(201).json({
            message : "success",
            newRecipe
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// PUT /recipes/:id
const updateRecipe =  async (req, res) => {
        for (let key in req.body) {
            if (req.body[key] != null) {
                res.recipe[key] = req.body[key];
            }
        }
        try {
            const updatedRecipe = await res.recipe.save();
            res.status(200).json({
                message : "success",
                updatedRecipe
            });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    };

// DELETE /recipes/:id
const deleteOneRecipe =  async (req, res) => {
    try {
        await res.recipe.remove();
        res.status(200).json({
            message: 'success' 
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getRecipe = async (req, res, next) => {
    let recipe;
    try {
        recipe = await Recipe.findById(req.params.id);
        if (recipe == null) {
            return res.status(404).json({ message: 'Aucune recette trouvée avec cet ID' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.recipe = recipe;
    next();

}


const reviewRecipe = async (req, res) => {
    try {
        
      console.log("recette commentaire end point");  
      const recipe = await Recipe.findById(req.params.id);

    //   console.log("recette trouvée : ", recipe.title);
    //   console.log("user connectée : ", req.user);
      const newReview = {
        user: req.user._id,
        comment: req.body.comment,
        rating: req.body.rating,
        date: new Date() 
      };
      
      console.log("le commentaire: ", newReview);


      
      recipe.reviews.push(newReview);
      
      // Recalculer la note moyenne
      recipe.rating = recipe.reviews.reduce((acc, review) => acc + review.rating, 0) / recipe.reviews.length;
  
      await recipe.save();
      res.status(201).json({
        message : "success",
        newReview
    });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

module.exports = {
    deleteOneRecipe,
    updateRecipe,
    createOneRecipe,
    getRecipes,
    getRecipeById,
    getRecipe,
    reviewRecipe

};
