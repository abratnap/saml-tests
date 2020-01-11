'use strict';

const home = require('./home');
const login = require('./login');
const logout = require('./logout');

/**
 * @name RouteInitialization
 *
 * @description Adds routes to an Express application
 *
 * @param {object} app - An Express application
 *
 * @returns {object} - A Promise that resolves to an Express application configured with routes
 */
module.exports = app => {
  return Promise.resolve(app)
    .then(login)
    .then(logout)
    .then(home);
};
