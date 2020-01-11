'use strict';

const { Strategy } = require('passport-saml');
const config = require('config');
const { capitalize } = require('lodash');
const { logger } = require('../../../utils');

/**
 * @description Authenticate user and set user profile
 *
 * @param {object} profile - user profile
 * @param {function} done - callback function
 *
 * @returns {function} - result of calling done callback function
 */
const authenticateUser = (profile, done) => {
  logger.info('Saml Strategy profile', profile);

  return done(
    null,
    {
      id: profile.uid,
      email: profile.emailaddress,
      displayName: profile.cn,
      firstName: capitalize(profile.firstName),
      lastName: capitalize(profile.lastName),
    }
  );
};

/**
 * @module
 * @description exports saml strategy object
 */
module.exports = new Strategy(config.passport.saml, authenticateUser);

