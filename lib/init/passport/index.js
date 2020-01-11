'use strict';

const passport = require('passport');
const config = require('config');
const { get } = require('lodash');
const { logger } = require('../../utils');
const strategy = require('./strategies');

/**
 * @name PassportInitialization
 *
 * @description Configures authentication strategy and initializes passport authentication
 *
 * @param {object} app - An express application
 *
 * @returns {Promise.object} - A Promise that resolves to an application configured to include a passport authentication strategy
 */
module.exports = app => {
  const activeStrategy = get(config.passport, 'strategy', null);

  if (activeStrategy) {
    passport.serializeUser((user, done) => {
      logger.info('passport.serializeUser()', user);
      done(null, user);
    });

    passport.deserializeUser((user, done) => {
      logger.info('passport.deserializeUser()', user);
      done(null, user);
    });

    passport.use(strategy[activeStrategy]);
    app.use(passport.initialize());
    app.use(passport.session());
  }

  return Promise.resolve(app);
};
