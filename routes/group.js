const groupHandler = require('./../controllers/group');
const authHandler = require('./../controllers/auth');
const homeworkHandler = require('./homework');
const express = require('express');
const router = express.Router();

router.use('/:slug/homework', homeworkHandler);
router.post('/newGroup', authHandler.protect, groupHandler.createNewGroup);
router.patch('/acceptUser', authHandler.protect,authHandler.permisons('profesor'), groupHandler.acceptUser);
router.patch('/requestAccess', authHandler.protect,authHandler.permisons('student'), groupHandler.requestAccess);

router.route('/')
    .get(groupHandler.getAllGroups)
    .post(groupHandler.createGroup);
router.route('/:id')
    .get(groupHandler.getGroup)
    .patch(groupHandler.updateGroup)
    .delete(groupHandler.deleteGroup);

module.exports = router;