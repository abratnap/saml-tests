'use strict';

/*
 * @name Index Route
 *
 * @description The home route of the application
 *
 * @param {object} app - An Express application
 * @returns {object} - A Promise that resolves to an application configured render a route at `/`
 */
const home = app => {
  app.get('/', (req, res) => {
    res.render('index', {
      title: 'Welcome to SAML Tets Repo!',
      team: {
        name: 'test',
        machineName: req.params.name,
        description: 'Test SAML test REPO.',
      },
    });
  });

  return Promise.resolve(app);
};

module.exports = home;
