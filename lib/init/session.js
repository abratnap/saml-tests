'use strict';

const config = require('config');
const session = require('express-session');

/**
 * @name SessionInitialization
 *
 * @description Configures express app to use sessions
 *
 * @param {object} app - An Express application
 * @returns {Promise.object} - A Promise that resolves to an Express application initialized to use express-sessions
 */
module.exports = app => {
  app.use(session(Object.assign(config.express.session, { })));

  return Promise.resolve(app);
};
