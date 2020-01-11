'use strict';

const express = require('express');
const path = require('path');

/*
 * @name Static Server Initialization
 *
 * @description Sets up static Express routes
 *
 * @param {object} app - An Express application
 * @returns {object} - A Promise that resolves to an application configured to use the `public` directory as a static asset server
 */
module.exports = app => {
  app.use(express.static(path.join(process.cwd(), 'public')));

  return Promise.resolve(app);
};
