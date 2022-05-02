const viewHandler = require('./../controllers/view');
const authHandler = require('./../controllers/auth');
const homeworkRouter = require('./homework');
const express = require('express');
const router = express.Router();


router.get('/', authHandler.isLoggedIn, viewHandler.getHome);
router.get('/me',authHandler.protect, viewHandler.getAccount);
router.get('/login', authHandler.isLoggedIn, viewHandler.getLogin)
router.get('/signup', authHandler.isLoggedIn, viewHandler.getSignUp)
router.get('/group/:groupSlug', authHandler.isLoggedIn, viewHandler.getGroup);
router.get('/group/:groupSlug/homework/:slug', authHandler.protect, viewHandler.getHomework);
router.get('/myGroups', authHandler.protect, viewHandler.getGroups);
router.get('/newGroup', authHandler.protect, authHandler.permisons('profesor','student'), viewHandler.getNewGroup);

module.exports = router;