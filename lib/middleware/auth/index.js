'use strict';

const digestSAML = require('./digest-saml');
const redirectAfterAuth = require('./redirect-after-auth');
const requireLogin = require('./require-login');

/**
 * @name AuthenticationMiddleware
 * @type object
 *
 * @description All available authentication middleware for the application
 *
 * @property {object} digestSAML - middleware that digests SAML response from w3 IDP provider
 * @property {object} redirectAfterAuth - middleware that redirects user after authentication
 * @property {object} requireLogin - middleware that checks if request is authenticated
 */
module.exports = {
  digestSAML,
  redirectAfterAuth,
  requireLogin,
};
