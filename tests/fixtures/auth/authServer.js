const express = require('express');
const views = require('../../../lib/init/views');
const bodyParser = require('../../../lib/init/body-parser');
const session = require('../../../lib/init/session');
const passport = require('../../../lib/init/passport');
const requireLogin = require('../../../lib/init/require-login');
const login = require('../../../lib/routes/login');
const logout = require('../../../lib/routes/logout');
const home = require('../../../lib/routes/home');

const server = () => {
  const app = express();

  return Promise.resolve(app)
    .then(views)
    .then(bodyParser)
    .then(session)
    .then(passport)
    .then(requireLogin)
    .then(login)
    .then(logout)
    .then(home);
};

module.exports = server;
