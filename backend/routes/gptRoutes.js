const gpt = require('./../utils/gpt');

const express = require('express')

const authConctroller = require('./../controllers/authConctroller');
const {getRecipe} = require('./../controllers/recipeController');

router = express.Router();


router.route('/find-complexity').post(gpt.findComplexity);

router.route('/search').post(authConctroller.protect,gpt.searchRecipe);

router.route('/chat-bot').post(authConctroller.protect,gpt.chatBot);

router.route('/recipe-accompaniments/:id').post(authConctroller.protect,getRecipe,gpt.getAccompaniments);

router.route('/shopping-list/:id').post(authConctroller.protect,getRecipe,gpt.getShoppingList);

module.exports = router; 
