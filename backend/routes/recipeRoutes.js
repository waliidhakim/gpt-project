const express = require('express');
const router = express.Router();
const Recipe = require('./../models/recipe');
const {protect} = require('./../controllers/authConctroller');
const recipeController = require('./../controllers/recipeController');



router.route('/').get(protect,recipeController.getRecipes);

router.route('/:id').get(protect,recipeController.getRecipe,recipeController.getRecipeById);

router.route('/').post(protect,recipeController.createOneRecipe);

router.route('/:id').put(protect,recipeController.getRecipe,recipeController.updateRecipe);

router.route('/:id').delete(protect,recipeController.getRecipe,recipeController.deleteOneRecipe);

router.route('/:id/reviews').post(protect,recipeController.getRecipe,recipeController.reviewRecipe);


module.exports = router;
