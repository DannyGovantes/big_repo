const express = require('express');
const homeworkHandler = require('./../controllers/homework');
const authHandler = require('./../controllers/auth');
const router = express.Router({ mergeParams: true });


router.patch('/uploadHomework',authHandler.protect, homeworkHandler.uploadFile, homeworkHandler.uploadHomework);

router.route('/')
    .get(homeworkHandler.getAllHomework)
    .post(homeworkHandler.createHomework);

router.route('/:id')
    .get(homeworkHandler.getHomework)
    .patch(homeworkHandler.updateHomework)
    .delete(homeworkHandler.updateHomework);

module.exports = router;