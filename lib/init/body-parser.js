'use strict';

const bodyParser = require('body-parser');

/**
 * @name BodyParserInitialization
 *
 * @description Initializes body-parser for use
 *
 * @param {object} app - An Express application
 *
 * @returns {Promise.object} - A Promise that resolves to an application that has been initialized to parse the body of incoming requests.
 */
module.exports = app => {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  return Promise.resolve(app);
};
