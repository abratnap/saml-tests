'use strict';

const local = require('./local');
const saml = require('./saml');

/**
 * @name AuthStrategies
 * @type object
 *
 * @description Available strategies for passport authentication
 *
 * @property {object} local - local authentication strategy
 * @property {object} saml - saml authentication strategy
 */
module.exports = {
  local,
  saml,
};
