/*
Import packages
*/
const express = require('express');

/*
Import custom packages
*/
const publicController = require('../controllers/publicController');

/*
Make a router
*/
const router = express.Router();

/*
Routes
*/
router.get('/', publicController.getHome);

// Export the router
module.exports = router;
