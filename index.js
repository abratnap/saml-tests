'use strict';

const express = require('express');
const config = require('config');

const { logger } = require('./lib/utils');

const init = require('./lib/init');
const routes = require('./lib/routes');

/*
 * @name Server
 *
 * @description Configures a raw Express application for use
 *
 * @returns {object} - A promise that resolves to the configured application
 */
const server = () => {
  const app = express();

  return Promise.resolve(app)
    .then(init)
    .then(routes);
};

/*
 * @description Runs the application if and only if this file is being run directly
 */
// Ignoring as there's no way to test listening
/* istanbul ignore next */
if (!module.parent) {
  server().then(app => {
    app.listen(config.env.port, () => {
      logger.info(`Server starting on ${config.env.url}`);
    });
  }).catch(e => {
    logger.error(e);
  });
}

module.exports = server;
