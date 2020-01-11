'use strict';

const defer = require('config/defer').deferConfig;
const { strategy } = require('../lib/enums');

module.exports = {
  passport: {
    strategy: strategy.Local, // make sure that you include file with this strategy name under `lib/init/passport/strategies`
    saml: {
      path: '/login/callback',
      identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format: transient',
      issuer: 'passport-saml',
    },
  },
  site: {
    name: 'SAMLTest',
  },
  env: {
    port: process.env.PORT || 8080,
    host: process.env.URL || 'localhost',
    url: defer(config => {
      return `${config.env.host}:${config.env.port}`;
    }),
  },
  express: {
    session: {
      secret: process.env.SESSION_SECRET || 'myrandomsessionsecret',
      resave: false,
      saveUninitialized: false,
      name: 'test-session',
      maxAge: 10 * 60 * 60 * 1000, // 10 hours
    },
  },
  databases: {
    redis: {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: process.env.REDIS_PORT || '6379',
      password: process.env.REDIS_PASSWORD,
    },
  },
  winston: {
    console: {
      level: 'info',
      handleExceptions: true,
      prettyPrint: true,
    },
  },
};
