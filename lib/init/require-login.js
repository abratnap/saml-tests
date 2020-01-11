'use strict';

const { requireLogin } = require('../middleware/auth');

/**
 * @name RequireLoginMiddlewareInitialization
 *
 * @description Initializes RequireLogin middleware for use
 *
 * @param {object} app - An Express application
 * @returns {object} - A Promise that resolves to an Express application that has been configured to check if request is authenticated or not
 */
module.exports = app => {
  app.use(requireLogin({ loginPath: '/login' }));

  return Promise.resolve(app);
};
