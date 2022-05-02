const userHandler = require('./../controllers/user');
const authHandler = require('./../controllers/auth');
const express = require('express');
const router = express.Router();



router.post('/signup', authHandler.signup);
router.post('/login', authHandler.login);
router.get('/logout', authHandler.logout);
router.post('/forgotPassword', authHandler.forgotPassword);
router.patch('/resetPassword/:token', authHandler.resetPassword);
router.patch('/updatePassword', authHandler.protect, authHandler.updatePassword);
router.patch('/updateMe', authHandler.protect, userHandler.uploadUserPhoto, userHandler.resizeUserPhoto, userHandler.updateMe);

router.route('/')
    .get(userHandler.getAllUsers)
    .post(userHandler.createUser);
router.route('/:id')
    .get(userHandler.getUser)
    .patch(userHandler.updateUser)
    .delete(userHandler.deleteUser);

module.exports = router;