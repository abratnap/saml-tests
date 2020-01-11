'use strict';

const config = require('config');
const { strategy } = require('../enums');

/**
 * @name LogoutRoute
 *
 * @description The logout route of the application
 *
 * @param {object} app - An Express application
 *
 * @returns {Promise.object} - A Promise that resolves to an application configured to render a route at `/logout`
 */
const logout = app => {
  if (config.passport.strategy === strategy.Local) {
    app.get('/logout', (req, res) => {
      req.logout();
      res.redirect('/login');
    });
  }

  return Promise.resolve(app);
};

module.exports = logout;
