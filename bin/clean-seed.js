#!/usr/bin/env node

'use strict';

/**
 * @file Removes seed data from the database
 */

const { pick } = require('lodash');
const driver = require('../lib/data/databases/neo4j/driver');
const logger = require('../lib/utils/logger');

/**
 * @typedef {Object} DeleteQueryStats
 * @property {int} nodesDeleted - The number of nodes deleted by the query
 * @property {int} relationshipsDeleted - The number of relationships deleted by the query
 */

/**
 * @name clean
 *
 * @description Removes seed data from the database
 *
 * @returns {Promise.DeleteQueryStats} Deletion statistics
 */
const clean = () => {
  return new Promise((resolve, reject) => {
    const session = driver.session();

    session.run('MATCH (n) WHERE n.seed DETACH DELETE n;').then(results => {
      session.close();
      const stats = pick(results.summary.counters._stats, ['nodesDeleted', 'relationshipsDeleted']);
      resolve(stats);
    }).catch(e => {
      session.close();
      reject(e);
    });
  });
};

/*
 * @description Runs clean-seed if and only if this file is being run directly
 */
// Ignoring as there's no way to test this file and not have this fail
/* istanbul ignore next */
if (!module.parent) {
  clean().then(stats => {
    logger.info(`${stats.nodesDeleted} nodes and ${stats.relationshipsDeleted} relationships deleted from the database`);
    process.exit(); // eslint-disable-line no-process-exit
  }).catch(e => {
    throw e;
  });
}

module.exports = clean;
