const Fuse = require('fuse.js');
const Recipe = require('./../models/recipe');

const searchRecipe =  async (req, res) => {
    try{
        console.log("search recipe");
        const searchTerm = req.query.term;
        const ingredientTerms = req.query.ingredients ? req.query.ingredients.split(',').map(ing => ing.trim().toLowerCase()) : [];
        let recipes = await Recipe.find({});

        // Configuration pour fuse.js pour recherche générale
        const optionsGeneralSearch = {
            keys: ['title', 'description'],
            threshold: 0.3
        };

        const fuse = new Fuse(recipes, optionsGeneralSearch);
        let results = fuse.search(searchTerm);

        // Filtrage basé sur les ingrédients
        if (ingredientTerms.length) {
            results = results.filter(recipe => {
                return ingredientTerms.some(ing => 
                    recipe.item.ingredients.some(recipeIng => 
                        recipeIng.toLowerCase().includes(ing)
                    )
                );
            });
        }
        

        res.status(200).json(
            {   
                message : "success",
                count : results.length,
                results
                
            })
    }
    catch(error)
    {
        console.log("error search : ", error);
        res.status(500).json(
            {   
                message : "Erreur lors de la récupération du résultat de la recherche",

            })
    }
    ;
};

module.exports ={

    searchRecipe
}
    