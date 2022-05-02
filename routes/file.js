const express = require('express');
const fileHandler = require('./../controllers/file');
const authHandler = require('./../controllers/auth');
const router = express.Router();

router.post('/uploadFile', authHandler.protect, fileHandler.uploadFile, fileHandler.createFile);

module.exports = router;