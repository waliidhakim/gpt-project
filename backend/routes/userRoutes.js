const express = require('express');

const userController = require('./../controllers/userController');
const authController = require('./../controllers/authConctroller');

const router = express.Router();

router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login);
router.route('/logout').get(authController.logout)

router.route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getUsers
    )

    .post(
        authController.protect,
        authController.restrictTo('admin'),
        userController.createOneUser
    )

router.route('/:id')
    .get(
        authController.protect,
        // authController.restrictTo('admin'),
        userController.getOneUser
        )

    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.deleteOneUser
    )
    .patch(
        authController.protect,
        authController.restrictTo('admin'),
        userController.updateOne
    )




module.exports = router;