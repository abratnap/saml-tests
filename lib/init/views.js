'use strict';

const nunjucks = require('nunjucks');
const path = require('path');

const views = [
  path.join(process.cwd(), 'views'),
  path.join(process.cwd(), 'templates'),
];

/*
 * @name Views Initialization
 *
 * @description Sets up [Nunjucks](https://mozilla.github.io/nunjucks/) as our application view engine
 *
 * @param {object} app - An Express application
 * @returns {object} - A Promise that resolves to an application configured to use Nunjucks as the view engine for `html` files
 */
module.exports = app => {
  nunjucks.configure(views, {
    autoescape: true,
    express: app,
  });
  app.set('view engine', 'html');

  return Promise.resolve(app);
};
