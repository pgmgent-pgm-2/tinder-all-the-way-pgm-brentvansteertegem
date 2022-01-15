/*
Import custom packages
*/
const dataService = require('../../services/dataService');
const { HTTPError, handleHTTPError } = require('../../utils');

/*
Get all matches
*/
const getMatches = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Get a specific match
*/
const getMatchByIds = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Get matches from a specific user
*/
const getMatchesFromUserById = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Create a new match
*/
const createMatch = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Update a specific match
*/
const updateMatch = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

/*
Delete a specific match
*/
const deleteMatch = (req, res, next) => {
  handleHTTPError(new HTTPError('The action method is not yet implemented!', 501), next);
};

// Export the action methods = callbacks
module.exports = {
  createMatch,
  deleteMatch,
  getMatches,
  getMatchByIds,
  getMatchesFromUserById,
  updateMatch,
};
