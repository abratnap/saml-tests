#!/usr/bin/env node

'use strict';

/**
 * @file Seeds the database with fake data
 */

const program = require('commander');
const faker = require('faker');
const { kebabCase, random } = require('lodash');
const logger = require('../lib/utils/logger');
const driver = require('../lib/data/databases/neo4j/driver');
const { init } = require('../lib/data/schema');

const usedTeamNames = { };
const groups = [
  'Collaboration Solutions',
  'Corporate Strategy',
  'Digital Business Group',
  'GBS',
  'GTS',
  'Global Markets',
  'Hybrid Cloud',
  'IBM Finance',
  'IBM HR',
  'Industry Platforms',
  'Legal & Regulatory Affairs',
  'Marketing & Communications',
  'Research',
  'Security',
  'Systems',
  'Transformation & Operations',
  'Watson & Cloud Platform',
  'Watson Health',
  'Watson IoT',
];
const roles = [
  'Software Engineer',
  'Designer',
  'STSM',
];

/*
 * @name Program Setup
 *
 * @description Sets up the program version and options
 */
program
  .version('0.0.1')
  .option('--num-teams <int>', 'number of teams to generate (defaults to 5)')
  .option('--num-members <int>', 'number of members per team (defaults to 5)')
  .option('--num-stakeholders <int>', 'number of stakeholders per team (defaults to 2)')
  .parse(process.argv);

/**
 * @name getNodes
 *
 * @description Gets database nodes
 *
 * @returns {object} Database nodes
 */
const getNodes = async () => {
  const schemas = await init.getSchema();
  const nodes = init.buildNodes(schemas);

  return nodes;
};

/**
 * @name generateTeam
 *
 * @description Generates a fake team
 *
 * @returns {object} Generated team
 */
const generateTeam = () => {
  const team = {
    label: 'team',
    active: true,
    description: faker.company.catchPhrase(),
  };
  do {
    team.name = faker.lorem.words();
  } while (usedTeamNames[team.name]);
  usedTeamNames[team.name] = true;
  team.machineName = kebabCase(team.name);

  return team;
};

/**
 * @name seedTeam
 *
 * @description Seeds a generated team in the database
 *
 * @param {object} nodes Database nodes
 * @param {int} maxAttempts Max number of attempts to seed the database
 * @returns {string} The seeded team
 */
const seedTeam = async (nodes, maxAttempts = 10) => {
  let team;
  let failure;
  let attempts = 0;
  do {
    failure = false;
    team = generateTeam();
    try {
      team = await nodes.team.create(team);
    }
    catch (e) {
      logger.debug(`Failed to create team (attempt ${attempts + 1}): ${e.message}`);
      failure = true;
      attempts++;
    }
  } while (failure && attempts < maxAttempts);

  if (failure) throw new Error('Failed to create team');

  return team;
};

/**
 * @name generatePerson
 *
 * @description Generates a fake person
 *
 * @returns {object} Generated person
 */
const generatePerson = () => {
  const person = {
    label: 'person',
    active: true,
    first: faker.name.firstName(),
    last: faker.name.lastName(),
    locality: faker.address.city(),
    state: faker.address.state(),
    country: faker.address.country(),
    image: faker.image.avatar(),
    code: 'P',
    isManager: false,
    group: groups[random(0, groups.length - 1)],
    unit: faker.lorem.word(),
    timezone: '+09:00',
    bluepagesID: faker.random.alphaNumeric(9),
  };
  person.email = `${person.first}.${person.last}@ibm.com`;
  person.permutations = `${person.first} ${person.last}`;

  return person;
};

/**
 * @name seedPerson
 *
 * @description Seeds a generated person in the database
 *
 * @param {object} nodes Database nodes
 * @param {int} maxAttempts Max number of attempts to seed the database
 * @returns {string} The seeded person
 */
const seedPerson = async (nodes, maxAttempts = 10) => {
  let person;
  let failure;
  let attempts = 0;
  do {
    failure = false;
    person = generatePerson();
    try {
      person = await nodes.person.create(person);
    }
    catch (e) {
      logger.debug(`Failed to create person (attempt ${attempts + 1}): ${e.message}`);
      failure = true;
      attempts++;
    }
  } while (failure && attempts < maxAttempts);

  if (failure) throw new Error('Failed to create person');

  return person;
};

/**
 * @name generateMemberRelationship
 *
 * @description Generates a member relationship
 *
 * @returns {object} Generated member relationship
 */
const generateMemberRelationship = () => {
  const relationship = {
    label: 'memberOf',
    active: true,
    joinDate: faker.date.past(),
    role: roles[random(0, roles.length - 1)],
  };

  return relationship;
};

/**
 * @name generateStakeholderRelationship
 *
 * @description Generates a stakeholder relationship
 *
 * @returns {object} Generated stakeholder relationship
 */
const generateStakeholderRelationship = () => {
  const relationship = {
    label: 'stakeholderOf',
    active: true,
  };

  return relationship;
};

/**
 * @name markSeedData
 *
 * @description Marks seed nodes with a 'seed' property
 * @param {array} uuids UUIDs of the nodes to be marked
 * @returns {Promise} Promise that resolves or rejects when the operation is complete
 */
const markSeedData = uuids => {
  const uuidWhereClauses = uuids.map((uuid, index) => {
    return `n.uuid = {${index}}`;
  }).join(' OR\n');

  const query = `MATCH (n) WHERE\n${uuidWhereClauses}\nSET n.seed = true;`;
  const queryParams = Object.assign({}, uuids);


  const session = driver.session();

  return session.run(query, queryParams).then(() => {
    session.close();

    return;
  });
};

/**
 * @name seed
 *
 * @description Seeds the database with fake data
 *
 * @param {int} numTeams The number of teams to generate (default 5)
 * @param {int} numMembers The number of members per team (default 5)
 * @param {int} numStakeholders The number of stakeholders per team (default 2)
 */
const seed = async (numTeams = 5, numMembers = 5, numStakeholders = 2) => {
  const nodes = await getNodes();
  const generatedUUIDs = [];

  for (let i = 0; i < numTeams; i++) {
    const team = await seedTeam(nodes);
    generatedUUIDs.push(team.uuid);
    team.label = 'team';

    for (let j = 0; j < numMembers; j++) {
      const person = await seedPerson(nodes);
      generatedUUIDs.push(person.uuid);
      person.label = 'person';
      const relationship = generateMemberRelationship();
      await nodes.person.connect(person, relationship, team);
    }

    for (let j = 0; j < numStakeholders; j++) {
      const person = await seedPerson(nodes);
      generatedUUIDs.push(person.uuid);
      person.label = 'person';
      const relationship = generateStakeholderRelationship();
      await nodes.person.connect(person, relationship, team);
    }
  }

  await markSeedData(generatedUUIDs);
};

/*
 * @description Runs seed if and only if this file is being run directly
 */
// Ignoring as there's no way to test this file and not have this fail
/* istanbul ignore next */
if (!module.parent) {
  const numTeams = program.numTeams || 5;
  const numMembers = program.numMembers || 5;
  const numStakeholders = program.numStakeholders || 2;
  seed(numTeams, numMembers, numStakeholders).then(() => {
    logger.info(`Seeded the database with ${numTeams} teams that each have ${numMembers} members and ${numStakeholders} stakeholders.`); // eslint-disable-line no-console
    process.exit(); // eslint-disable-line no-process-exit
  }).catch(e => {
    throw e;
  });
}

module.exports = {
  seed,
  seedTeam,
  seedPerson,
};
