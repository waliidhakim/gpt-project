const express = require("express");
const goalsController = require('./../controllers/goalsController');

const router = express.Router();



router.route('/')
    .get(goalsController.getGoals)
    .post(goalsController.addGoal);

router.route('/:id')
    .delete(goalsController.deleteGoal)

module.exports = router;
