/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { handleHTTPError } = require('../../utils');

/*
Get all matches
*/
const getMatches = (req, res, next) => {
  try {
    // Get matches from dataService
    const matches = dataService.getMatches();
    // Send response
    res.status(200).json(matches);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Get a specific match
*/
const getMatchByIds = (req, res, next) => {
  try {
    // Get sender id and reciver id from url
    const { senderId, receiverId } = req.params;
    // Get match between users from dataService
    const match = dataService.getMatchByIds(senderId, receiverId);
    // Send response
    res.status(200).json(match);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Get all matches from a specific user
*/
const getMatchesFromUserById = (req, res, next) => {
  try {
    // Get userId from url
    const { userId } = req.params;
    // Get matches from user from dataService
    const matches = dataService.getMatchesForUser(userId);
    // Send response
    res.status(200).json(matches);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Create a new match
*/
const createMatch = (req, res, next) => {
  try {
    // Get body from request
    const match = req.body;
    // Create a match
    const createdMatch = dataService.createMatch(match);
    res.status(201).json(createdMatch);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Update a specific match
*/
const updateMatch = (req, res, next) => {
  try {
    // Get sender id and reciver id from url
    const { senderId, receiverId } = req.params;
    // Get body from request
    const newInformation = req.body;
    // Update match
    const updatedMatch = dataService.updateMatch(senderId, receiverId, newInformation);
    // Send response
    res.status(200).json(updatedMatch);
  } catch (error) {
    handleHTTPError(error, next);
  }
};

/*
Delete a specific match
*/
const deleteMatch = (req, res, next) => {
  try {
    // Get sender id and reciver id from url
    const { senderId, receiverId } = req.params;
    // Delete match
    dataService.deleteMatch(senderId, receiverId);
    // Send response
    res.status(204).json();
  } catch (error) {
    handleHTTPError(error, next);
  }
};

// Export the action methods = callbacks
module.exports = {
  getMatches,
  getMatchByIds,
  getMatchesFromUserById,
  createMatch,
  updateMatch,
  deleteMatch,
};
