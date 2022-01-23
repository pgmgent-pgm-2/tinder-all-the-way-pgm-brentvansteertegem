/*
Import packages
*/
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/*
Import custom packages
*/
const { HTTPError } = require('../utils');

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
      if (a.firstName > b.firstname) {
        return 1;
      } if (a.firstName < b.firstName) {
        return -1;
      }
      return 0;
    });
    return users;
  } catch (error) {
    throw new HTTPError('Can\'t get users!', 500);
  }
};

// Get a specific user
const getUserById = (userId) => {
  try {
    const users = readDataFromUsersFile();
    // Find a user based on user id
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new HTTPError(`Can't find user with id:'${userId}'`, 404);
    }
    return user;
  } catch (error) {
    throw new HTTPError(`Can't get user with id:'${userId}'`, 500);
  }
};

// Create a new user
const createUser = (user) => {
  try {
    // Get all users
    const users = readDataFromUsersFile();
    // Create user
    const userToCreate = {
      id: uuidv4(),
      ...user,
      createdAt: Date.now(),
    };
    users.push(userToCreate);
    // Write users to users.json
    fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));
    // Return the created user
    return userToCreate;
  } catch (error) {
    throw new HTTPError('Can\'t create user', 500);
  }
};

// Update a specific user
const updateUser = (userId, newInformation) => {
  try {
    const users = readDataFromUsersFile();
    // Find a user based on user id
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new HTTPError(`Can't find user with id:'${userId}'`, 404);
    }
    // Update user
    const updatedUser = {
      ...user,
      ...newInformation,
    };
    users.splice(users.indexOf(users.find((u) => u.id === userId)), 1, updatedUser);
    // Write users to users.json
    fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));
    // Return the updated user
    return updatedUser;
  } catch (error) {
    throw new HTTPError(`Can't update user with id:'${userId}'`, 500);
  }
};

// Delete a specific user
const deleteUser = (userId) => {
  try {
    const users = readDataFromUsersFile();
    // Find a user based on user id
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new HTTPError(`Can't find user with id:'${userId}'`, 404);
    }
    // Delete user
    users.splice(users.indexOf(users.find((u) => u.id === userId)), 1);
    // Write users to users.json
    fs.writeFileSync(filePathUsers, JSON.stringify(users, null, 2));
    return null;
  } catch (error) {
    throw new HTTPError(`Can't delete user with id:'${userId}'`, 500);
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
    throw new HTTPError('Can\'t get messages!', 500);
  }
};

// Get a specific message
const getMessageById = (messageId) => {
  try {
    const messages = readDataFromMessagesFile();
    // Find a message based on message id
    const message = messages.find((m) => m.id === messageId);
    if (!message) {
      throw new HTTPError(`Can't find message with id:'${messageId}'`, 404);
    }
    return message;
  } catch (error) {
    throw new HTTPError(`Can't get message with id:'${messageId}'`, 500);
  }
};

// Get all messages from a specific user
const getMessagesFromUser = (userId) => {
  try {
    const messages = readDataFromMessagesFile();
    // Filter messages based on user id
    const messagesFromUser = messages.filter((m) => m.senderId === userId || m.receiverId === userId);
    if (!messagesFromUser) {
      throw new HTTPError(`Can't find messages for user with id:'${userId}'`, 404);
    } else {
      // Sort messages chronologically (from newest to oldest)
      messagesFromUser.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1;
        } if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });
    }    
    return messagesFromUser;
  } catch (error) {
    throw new HTTPError(`Can't get messages from user with id:'${userId}'`, 500);
  }
};

// Get all received messages from a specific user
const getReceivedMessagesFromUser = (userId) => {
  try {
    const messages = readDataFromMessagesFile();
    // Filter messages based on user id
    const receivedMessagesFromUser = messages.filter((m) => m.receiverId === userId);
    if (!receivedMessagesFromUser) {
      throw new HTTPError(`Can't find received messages for user with id:'${userId}'`, 404);
    } else {
      // Sort messages chronologically (from newest to oldest)
      receivedMessagesFromUser.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1;
        } if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });
    }
    return receivedMessagesFromUser;
  } catch (error) {
    throw new HTTPError(`Can't get received messages from user with id:'${userId}'`, 500);
  }
};

// Get all sent messages from a specific user
const getSentMessagesFromUser = (userId) => {
  try {
    const messages = readDataFromMessagesFile();
    // Filter messages based on user id
    const sentMessagesFromUser = messages.filter((m) => m.senderId === userId);
    if (!sentMessagesFromUser) {
      throw new HTTPError(`Can't find sent messages from user with id:'${userId}'`, 404);
    } else {
      // Sort messages chronologically (from newest to oldest)
      sentMessagesFromUser.sort((a, b) => {
        if (a.createdAt < b.createdAt) {
          return 1;
        } if (a.createdAt > b.createdAt) {
          return -1;
        }
        return 0;
      });
    }
    return sentMessagesFromUser;
  } catch (error) {
    throw new HTTPError(`Can't get sent messages from user with id:'${userId}'`, 500);
  }
};

// Get all messages between two users
const getConversationBetweenUsers = (userId, friendId) => {
  try {
    const messages = readDataFromMessagesFile();
    // Filter messages based on user id
    // eslint-disable-next-line no-mixed-operators, max-len
    const messagesBetweenUsers = messages.filter((msg) => msg.senderId === userId && msg.receiverId === friendId || msg.senderId === friendId && msg.receiverId === userId);
    if (!messagesBetweenUsers) {
      throw new HTTPError(`Can't find messages between users with id's:'${userId}' & '${friendId}'`, 404);
    } else {
      // Sort messages chronologically (from oldest to newest)
      messagesBetweenUsers.sort((a, b) => {
        if (a.createdAt > b.createdAt) {
          return 1;
        } if (a.createdAt < b.createdAt) {
          return -1;
        }
        return 0;
      });
    }
    return messagesBetweenUsers;
  } catch (error) {
    throw new HTTPError(`Can't get messages between users with id's:'${userId}' & '${friendId}'`, 500);
  }
};

// Create a new message
const createMessage = (message) => {
  try {
    // Get all messages
    const messages = readDataFromMessagesFile();
    // Create message
    const messageToCreate = {
      id: uuidv4(),
      ...message,
      createdAt: Date.now(),
    };
    messages.push(messageToCreate);
    // Write messages to messages.json
    fs.writeFileSync(filePathMessages, JSON.stringify(messages, null, 2));
    // Return the created message
    return messageToCreate;
  } catch (error) {
    throw new HTTPError('Can\'t create message', 500);
  }
};

// Update a specific message
const updateMessage = (messageId, newInformation) => {
  try {
    const messages = readDataFromMessagesFile();
    // Find a message based on message id
    const message = messages.find((m) => m.id === messageId);
    if (!message) {
      throw new HTTPError(`Can't find message with id:'${messageId}'`, 404);
    }
    // Update message
    const updatedMessage = {
      ...message,
      ...newInformation,
    };
    messages.splice(messages.indexOf(messages.find((m) => m.id === messageId)), 1, updatedMessage);
    // Write messages to messages.json
    fs.writeFileSync(filePathMessages, JSON.stringify(messages, null, 2));
    // Return the updated message
    return updatedMessage;
  } catch (error) {
    throw new HTTPError(`Can't update message with id:'${messageId}'`, 500);
  }
};

// Delete a specific user
const deleteMessage = (messageId) => {
  try {
    const messages = readDataFromMessagesFile();
    // Find a message based on message id
    const message = messages.find((m) => m.id === messageId);
    if (!message) {
      throw new HTTPError(`Can't find message with id:'${messageId}'`, 404);
    }
    // Delete message
    messages.splice(messages.indexOf(messages.find((m) => m.id === messageId)), 1);
    // Write messages to messages.json
    fs.writeFileSync(filePathMessages, JSON.stringify(messages, null, 2));
    return null;
  } catch (error) {
    throw new HTTPError(`Can't delete messages with id:'${messageId}'`, 500);
  }
};

// Read data from matches file
const readDataFromMatchesFile = () => readDataFromFile(filePathMatches);

// Get all matches
const getMatches = () => {
  try {
    const matches = readDataFromMatchesFile();
    // Sort matches chronologically (from newest to oldest)
    matches.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      } if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0;
    });
    return matches;
  } catch (error) {
    throw new HTTPError('Can\'t get matches!', 500);
  }
};

// Get all matches from a specific user
const getMatchesForUser = (userId) => {
  try {
    const matches = readDataFromMatchesFile();
    // Filter matches based on user id
    const matchesFromUser = matches.filter((match) => match.userId === userId || match.friendId === userId);
    if (!matchesFromUser) {
      throw new HTTPError(`Can't find matches for user with id:'${userId}'`, 404);
    }
    // Sort matches chronologically (from newest to oldest)
    matchesFromUser.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      } if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0;
    });
    return matchesFromUser;
  } catch (error) {
    throw new HTTPError(`Can't get matches for user with id:'${userId}'`, 500);
  }
};

// Get a specific match based on sender id and receiver id
const getMatchByIds = (senderId, receiverId) => {
  try {
    const matches = readDataFromMatchesFile();
    // Find match based on sender id and receiver id
    // eslint-disable-next-line max-len, no-mixed-operators
    const match = matches.find((m) => m.userId === senderId && m.friendId === receiverId || m.userId === receiverId && m.friendId === senderId);
    if (!match) {
      throw new HTTPError(`Can't find match for users with id's: '${senderId}' and '${receiverId}'`, 404);
    }
    return match;
  } catch (error) {
    throw new HTTPError(`Can't get match for users with id's: '${senderId}' and '${receiverId}'`, 500);
  }
};

// Create a new match
const createMatch = (match) => {
  try {
    // Get all matches
    const matches = readDataFromMatchesFile();
    // Create match
    const matchToCreate = {
      ...match,
      createdAt: Date.now(),
    };
    matches.push(matchToCreate);
    // Write messages to matches.json
    fs.writeFileSync(filePathMatches, JSON.stringify(matches, null, 2));
    // Return the created message
    return matchToCreate;
  } catch (error) {
    throw new HTTPError('Can\'t create match', 500);
  }
};

// Export all the methods of the data service
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getMessages,
  getMessageById,
  getMessagesFromUser,
  getReceivedMessagesFromUser,
  getSentMessagesFromUser,
  getConversationBetweenUsers,
  createMessage,
  updateMessage,
  deleteMessage,
  getMatches,
  getMatchesForUser,
  getMatchByIds,
  createMatch,
};
