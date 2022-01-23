/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { handleHTTPError } = require('../../utils');

/*
Get all users
*/
const getUsers = (req, res, next) => {
  try {
    // Get users from dataService
    const users = dataService.getUsers();
    // Send response
    res.status(200).json(users);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Get a specific user
*/
const getUserById = (req, res, next) => {
  try {
    // Get userId from url
    const { userId } = req.params;
    // Get user from dataService
    const user = dataService.getUserById(userId);
    // Send response
    res.status(200).json(user);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Create a new user
*/
const createUser = (req, res, next) => {
  try {
    // Get body from request
    const user = req.body;
    // Create a user
    const createdUser = dataService.createUser(user);
    res.status(201).json(createdUser);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Update a specific user
*/
const updateUser = (req, res, next) => {
  try {
    // Get userId from url
    const { userId } = req.params;
    // Get body from request
    const newInformation = req.body;
    // Update user
    const updatedUser = dataService.updateUser(userId, newInformation);
    res.status(200).json(updatedUser);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Delete a specific user
*/
const deleteUser = (req, res, next) => {
  try {
    // Get userId from url
    const { userId } = req.params;
    // Delete user
    dataService.deleteUser(userId);
    res.status(204).json();
  } catch (error) {
    handleHTTPError(error, next);
  }
};

// Export the action methods = callbacks
module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
