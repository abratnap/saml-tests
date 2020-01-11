'use strict';

/**
 * @readonly
 * @enum {string} enum for all available passport strategy strings
 */
const Strategies = Object.freeze({

  /** Local strategy */
  Local: 'local',

  /** Saml strategy */
  Saml: 'saml',
});

module.exports = Strategies;
