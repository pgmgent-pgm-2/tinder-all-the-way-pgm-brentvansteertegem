/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { HTTPError, handleHTTPError } = require('../../utils');

/*
Get all messages
*/
const getMessages = (req, res, next) => {
  try {
    // Get messages from dataService
    const messages = dataService.getMessages();
    // Send response
    res.status(200).json(messages);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Get a specific message
*/
const getMessageById = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Get all messages from a specific user
*/
const getMessagesFromUserById = (req, res, next) => {
  try {
    // Get userId from url
    const { userId } = req.params;
    // Get messages from user from dataService
    let messages = null;
    switch (req.query.type) {
      case 'received':
        messages = dataService.getReceivedMessagesFromUser(userId);
        break;
      case 'sent':
        messages = dataService.getSentMessagesFromUser(userId);
        break;
      case 'conversation':
        if (req.query.friendId) {
          messages = dataService.getConversationBetweenUsers(userId, req.query.friendId);
        }
        break;
      default:
        messages = dataService.getMessagesFromUser(userId);
    }
    // Send response
    res.status(200).json(messages);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Create a new message
*/
const createMessage = (req, res, next) => {
  try {
    // Get body from request
    const message = req.body;
    // Create a message
    const createdMessage = dataService.createMessage(message);
    res.status(201).json(createdMessage);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Update a specific message
*/
const updateMessage = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Delete a specific message
*/
const deleteMessage = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

// Export the action methods = callbacks
module.exports = {
  createMessage,
  deleteMessage,
  getMessages,
  getMessageById,
  getMessagesFromUserById,
  updateMessage,
};
