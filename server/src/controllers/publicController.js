/*
Import custom packages
*/
const dataService = require('../services/dataService');
const { HTTPError, handleHTTPError } = require('../utils');

/*
Get Home Render
*/
const getHome = (req, res, next) => {
  try {
    // Send response
    res.render('index', {
    });
  } catch (error) {
    handleHTTPError(error, next);
  }
};

module.exports = {
  getHome,
};
