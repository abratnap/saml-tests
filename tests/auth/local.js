import test from 'ava';
import request from 'supertest';
import { set } from 'lodash';
import server from '../fixtures/auth/authServer';

test.beforeEach(async t => {
  const app = await server();
  set(t.context, 'user', request.agent(app));
});

test('Should support local login', t => {
  return t.context.user.get('/bad')
    .expect('location', '/login')
    .expect(302)
    .then(() => {
      return t.context.user.get('/login')
        .expect(200);
    })
    .then(() => {
      return t.context.user.post('/login')
        .send({
          username: 'user',
          password: 'user',
        })
        .expect('location', '/bad')
        .expect(302);
    })
    .then(() => {
      return t.context.user.get('/')
        .expect(200);
    });
});


test('Should support log out', t => {
  return t.context.user.post('/login')
    .send({
      username: 'user',
      password: 'user',
    })
    .expect('location', '/')
    .expect(302)
    .then(() => {
      return t.context.user.get('/logout')
        .expect(302)
        .expect('location', '/login');
    })
    .then(() => {
      return t.context.user.get('/bad')
        .expect('location', '/login')
        .expect(302);
    });
});

test('Should redirect to login on bad username and password', t => {
  return t.context.user.post('/login')
    .send({
      username: 'bad',
      password: 'bad',
    })
    .expect('location', '/login')
    .expect(302)
    .then(() => {
      return t.context.user.get('/bad')
        .expect('location', '/login')
        .expect(302);
    });
});
