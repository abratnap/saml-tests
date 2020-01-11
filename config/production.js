'use strict';

const fs = require('fs');
const path = require('path');
const { strategy } = require('../lib/enums');

module.exports = {
  newrelic: {
    /* eslint-disable camelcase */
    agent_enabled: true,
    browser_monitoring: {
      enable: true,
    },
    /* eslint-disable camelcase */
  },
  passport: {
    strategy: strategy.Saml,
    saml: {
      entryPoint: 'https://test.com/auth/sps/samlidp/saml20/logininitial?RequestBinding=HTTPPost&PartnerId=passport-test-com&NameIdFormat=email&Target=test-app',
      cert: fs.readFileSync(path.join(process.cwd(), 'config/certs', 'samlidp_CIS_PRODUCTION.pem'), 'utf-8'),
    },
  },
  winston: {
    logentries: {
      token: process.env.LOGENTRIES_TOKEN,
      minLevel: 'debug',
      handleExceptions: true,
    },
    console: {
      level: 'error',
      handleExceptions: true,
      prettyPrint: false,
    },
  },
};
