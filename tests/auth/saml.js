import test from 'ava';
import request from 'supertest';
import config from 'config';
import fs from 'fs';
import path from 'path';
import base64 from 'base-64';
import urlencode from 'urlencode';
import cookie from 'cookie';
import { set, merge } from 'lodash';
import { redis } from '../../lib/data/databases';
import server from '../fixtures/auth/authServer';
import { strategy } from '../../lib/enums';

const confOptions = {
  strategy: strategy.Saml,
  saml: {
    entryPoint: 'test-idp-server',
  },
};

merge(config.passport, confOptions);

const validSAMLAssertion = fs.readFileSync(
  path.join(process.cwd(), 'tests/fixtures/auth/saml/signed-assertion.xml'), 'utf8');
const encodedValidSAMLResponse = urlencode(base64.encode(validSAMLAssertion));

const ivalidSAMLAssertion = fs.readFileSync(
  path.join(process.cwd(), 'tests/fixtures/auth/saml/signed-assertion-invalid-signature.xml'), 'utf8');
const encodedInvalidSAMLResponse = urlencode(base64.encode(ivalidSAMLAssertion));

const validUser = {
  'id': '1A0000897',
  'email': 'Harry.Potter@test.com',
  'displayName': 'HARRY A. POTTER',
  'firstName': 'Harry',
  'lastName': 'Potter',
};

let sessionCookieName;

function validateStoredSessionInfo(res) {
  return new Promise((resolve, reject) => {
    let cookies;
    let redisKey;
    try {
      cookies = cookie.parse(res.header['set-cookie'][0]);
      redisKey = cookies['test-session'].substring(2, 34);
    }
    catch (e) {
      reject(new Error('Unable to get session cookie'));
    }

    sessionCookieName = `sess:${redisKey}`;
    redis.get(sessionCookieName, (err, result) => {
      if (err) reject(err);
      const storedSession = JSON.parse(result);
      if (!storedSession.authRedirectURL) reject(new Error('The redirection URL not store in session'));
      resolve(res);
    });
  });
}

function validateStoredUserSessionInfo(res) {
  return new Promise((resolve, reject) => {
    redis.get(sessionCookieName, (err, result) => {
      if (err) reject(err);
      const storedSession = JSON.parse(result);
      if (JSON.stringify(storedSession.passport.user) === JSON.stringify(validUser)) {
        resolve(res);
      }
      else {
        reject(new Error('No valid User stored in session'));
      }
    });
  });
}

test.beforeEach(async t => {
  const app = await server();
  set(t.context, 'user', request.agent(app));
});

test('Should support login if SAML is enabled', t => {
  return t.context.user.get('/bad')
    .expect('location', '/login')
    .expect(302)
    .expect('set-cookie', /test-session=*/)
    .then(validateStoredSessionInfo)
    .then(() => {
      // check location is IDP location also possibly if SAMLResponse param is correct
      return t.context.user.get('/login')
        .expect(302)
        .expect('location', /test-idp-server*/);
    })
    .then(() => {
      // Assume successful login and Redirect from IDP provider
      return t.context.user.post(config.passport.saml.path)
        .send(`SAMLResponse=${encodedValidSAMLResponse}`)
        .expect('location', '/bad')
        .expect(302);
    })
    .then(validateStoredUserSessionInfo);
});


// Multiple reasons for invalid saml assertion - eg. unable to parse it, saml assertion expired, etc
test('Should error on invalid SAML assertion', t => {
  return t.context.user.get('/')
    .expect('location', '/login')
    .expect(302)
    .expect('set-cookie', /test-session=*/)
    .then(() => {
      // check location is IDP location also possibly if SAMLResponse param is correct
      return t.context.user.get('/login')
        .expect(302)
        .expect('location', /test-idp-server*/);
    })
    .then(() => {
      // Assume successful login and Redirect from IDP provider and send invalid SAML Response
      return t.context.user.post(config.passport.saml.path)
        .send(`SAMLResponse=${encodedInvalidSAMLResponse}`)
        .expect(500);
    });
});

