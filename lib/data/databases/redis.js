'use strict';

const { databases: { redis: config } } = require('config');
const redis = require('redis');
const client = redis.createClient(config);

module.exports = client;
