/*
Import packages
*/
const express = require('express');

/*
Import custom packages
*/
const messageController = require('../controllers/messageController');
const matchController = require('../controllers/matchController');
const userController = require('../controllers/userController');

/*
Make a router
*/
const router = express.Router();

/*
Routes for users
*/
router.get('/users', userController.getUsers);
router.get('/users/:userId', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:userId', userController.updateUser);
router.delete('/users/:userId', userController.deleteUser);
router.get('/users/:userId/messages', messageController.getMessagesFromUserById);
router.get('/users/:userId/matches', matchController.getMatchesFromUserById);

/*
Routes for messages
*/
router.get('/messages', messageController.getMessages);
router.get('/messages/:messageId', messageController.getMessageById);
router.post('/messages', messageController.createMessage);
router.put('/messages/:messageId', messageController.updateMessage);
router.delete('/messages/:messageId', messageController.deleteMessage);

/*
Routes for matches
*/
router.get('/matches', matchController.getMatches);
router.get('/matches/:senderId/:receiverId', matchController.getMatchByIds);
router.post('/matches', matchController.createMatch);
router.put('/matches/:senderId/:receiverId', matchController.updateMatch);
router.delete('/matches/:senderId/:receiverId', matchController.deleteMatch);

// Export the router
module.exports = router;
