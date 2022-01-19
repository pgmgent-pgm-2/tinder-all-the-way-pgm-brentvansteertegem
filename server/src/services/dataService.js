/*
Import packages
*/
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/*
Import custom packages
*/
const { HTTPError, convertArrayToPagedObject } = require('../utils');

/*
File paths
*/
const filePathUsers = path.join(__dirname, '..', 'data', 'users.json');
const filePathMessages = path.join(__dirname, '..', 'data', 'messages.json');
const filePathMatches = path.join(__dirname, '..', 'data', 'matches.json');

/*
Write your methods from here
*/
// Read data from file
const readDataFromFile = (filePath) => {
  const data = fs.readFileSync(filePath, { encoding: 'utf-8', flag: 'r' });
  const json = JSON.parse(data);
  return json;
};

// Read data from users file
const readDataFromUsersFile = () => readDataFromFile(filePathUsers);

// Get all users
const getUsers = () => {
  try {
    const users = readDataFromUsersFile();
    // Sort users alphabetically
    users.sort((a, b) => {
      if (a.username > b.username) {
        return 1;
      } if (a.username < b.username) {
        return -1;
      }
      return 0;
    });
    return users;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

// Get all messages from a specific user
const getUserById = (userId) => {
  try {
    const users = readDataFromUsersFile();
    // Filter users based on user id
    const user = users.filter((u) => u.id === userId);
    if (!user) {
      throw new HTTPError(`Can't find user with id:'${userId}'`, 404);
    }
    return user;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

// Read data from messages file
const readDataFromMessagesFile = () => readDataFromFile(filePathMessages);

// Get all messages
const getMessages = () => {
  try {
    const messages = readDataFromMessagesFile();
    // Sort messages chronologically
    messages.sort((a, b) => {
      if (a.createdAt > b.createdAt) {
        return 1;
      } if (a.createdAt < b.createdAt) {
        return -1;
      }
      return 0;
    });
    return messages;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

// Get all messages from a specific user
const getMessagesFromUser = (userId) => {
  try {
    const messages = readDataFromMessagesFile();
    // Filter messages based on user id
    const messagesFromUser = messages.filter((msg) => msg.senderId === userId || msg.receiverId === userId);
    if (!messagesFromUser) {
      throw new HTTPError(`Can't find messages for user with id:'${userId}'`, 404);
    }
    // Sort messages chronologically (from newest to oldest)
    messagesFromUser.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      } if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0;
    });
    return messagesFromUser;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

// Export all the methods of the data service
module.exports = {
  getUsers,
  getUserById,
  getMessages,
  getMessagesFromUser,
};
