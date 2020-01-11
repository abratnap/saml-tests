'use strict';
const views = require('./views');
const bodyParser = require('./body-parser');
const session = require('./session');
const passport = require('./passport');
const requireLogin = require('./require-login');

/**
 * @name AppInitialization
 *
 * @description Initializes an Express application for use
 *
 * @param {object} app - An Express application
 * @returns {object} - A Promise that resolves to an Express application that has been initialized
 */
module.exports = app => {
  return Promise.resolve(app)
    .then(views)
    .then(bodyParser)
    .then(session)
    .then(passport)
    .then(requireLogin);
};
