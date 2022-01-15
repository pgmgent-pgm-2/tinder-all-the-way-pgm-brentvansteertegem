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
const readDataFromUsersFile = () => {
  const data = fs.readFileSync(filePathUsers, { encoding: 'utf-8', flag: 'r' });
  const users = JSON.parse(data);
  return users;
};

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

// Export all the methods of the data service
module.exports = {
  getUsers,
};
