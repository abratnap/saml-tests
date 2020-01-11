'use strict';

const { Strategy } = require('passport-local');
const users = [
  {
    id: 'user',
    password: 'user',
    email: 'user@test.com',
    displayName: 'The User',
    firstName: 'The',
    lastName: 'User',
  },
];

/**
 * @name AuthenticateUser
 * @description Authenticate user by checking username and password
 *
 * @param {string} username - username
 * @param {string} password - password
 * @param {function} done - callback function
 *
 * @returns {function} - result of calling done callback function
 */
const authenticateUser = (username, password, done) => {
  const authUser = users.find((user) => {
    return username === user.id && password === user.password;
  });

  if (authUser) {
    return done(null, authUser);
  }

  return done(null, false, { message: 'Invalid username and/or password.' });
};

/**
 * @module
 * @description exports local strategy object
 */
module.exports = new Strategy(authenticateUser);

