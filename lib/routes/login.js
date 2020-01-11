'use strict';

const passport = require('passport');
const config = require('config');
const { digestSAML, redirectAfterAuth } = require('../middleware/auth');
const { strategy } = require('../enums');

/**
 * @name LoginRoute
 *
 * @description The login route of the application
 *
 * @param {object} app - An Express application
 *
 * @returns {Promise.object} - A Promise that resolves to an application configured to render a route at `/login`
 */
const login = app => {
  if (config.passport.strategy === strategy.Saml) {
    app.get('/login/error',
      (req, res) => {
        res.status(500).render('login/error', {
          title: 'Login Error!',
        });
      }
    );

    app.get('/login',
      passport.authenticate(config.passport.strategy, { failureRedirect: '/login/error' })
    );

    app.post(config.passport.saml.path,
      digestSAML,
      passport.authenticate(config.passport.strategy, { failureRedirect: '/login/error' }),
      redirectAfterAuth
    );
  }
  else {
    app.post('/login',
      passport.authenticate(config.passport.strategy, { failureRedirect: '/login' }),
      redirectAfterAuth
    );

    app.get('/login',
      (req, res) => {
        res.render('login/index');
      }
    );
  }

  return Promise.resolve(app);
};

module.exports = login;
