'use strict';

const { set } = require('lodash');

/**
 * @module
 * @description middleware that ensures the user is logged in.
 *
 * @param {object} options - Method options
 * @param {string} options.loginPath - the path which needs to be skipped by this middleware. The login path must be skipped to avoid endless redirection
 *
 * @returns {function | undefined} - result of calling next route handler function or redirects a response
 */
module.exports = (options = {}) => {
  return (req, res, next) => {
    if (req.isAuthenticated() || req.path.startsWith(options.loginPath)) {
      return next();
    }

    set(req, 'session.authRedirectURL', req.url);

    return res.redirect(options.loginPath);
  };
};
