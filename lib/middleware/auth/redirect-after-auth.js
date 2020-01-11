'use strict';

const { unset } = require('lodash');

/**
 * @module
 * @description Redirects to original requested URL after authentication
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 *
 * @returns {undefined} - redirects a response
 */
module.exports = (req, res) => {
  const redirectURL = req.session.authRedirectURL || '/';
  unset(req, 'session.authRedirectURL');

  return res.redirect(redirectURL);
};
