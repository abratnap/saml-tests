#!/usr/bin/env node

'use strict';

/*
 * @file Updates YAML files to replace __TOKEN__ with the token's value in environment variables. Useful for updating Bluemix manifest files with secrets from a secret vault.
 */

const program = require('commander');
const yaml = require('js-yaml');
const fs = require('fs-extra');
const path = require('path');

/*
 * @name Program Setup
 *
 * @description Sets up the program version and options
 */
program
  .version('0.0.1')
  .option('-m, --manifest <path>', 'relative path to the input manifest file to use (defaults to `manifest.yml`)')
  .option('-o, --output <path>', 'relative path for output manifest file (defaults to `manifest.yml`)')
  .parse(process.argv);

/*
 * @function updateManifest
 *
 * @description Updates the input manifest file by replacing tokens with environment variables, and outputs the update to a new manifest file
 *
 * @param {string} input - the YAML file to use as input, relative to the process working directory
 * @param {string} output - The file name to output the updated file to, relative to the process working directory
 *
 * @returns {object} - An object containing three keys, `manifest` which is the full updated YAML contents, `replacements` that contains an {array} of {object}s where the key is the replaced token and the value is the value it was replaced with, and `unused` which is an array of unreplaced tokens. The function will also write to disk the contents of `manifest` to the @param `output`
 */
function updateManifest(input, output = 'manifest.yml') {
  // Find and read in manifest file
  let inputFile = input;

  // Need to ignore otherwise our tests will fail and we leak our secrets in to our Travis logs
  /* istanbul ignore next */
  if (typeof inputFile !== 'string' && process.env.TRAVIS_BRANCH === 'master') {
    inputFile = 'production.yml';
  }
  else if (typeof inputFile !== 'string' && process.env.TRAVIS_BRANCH === 'develop') {
    inputFile = 'staging.yml';
  }
  else if (typeof inputFile !== 'string') {
    throw new Error('No input manifest found');
  }


  const basePath = path.join(process.cwd(), inputFile);
  let baseFile = fs.readFileSync(basePath, 'utf8');

  // RegEx to match __STUFF__
  const token = /_{2}(\w*)_{2}/g;
  const unused = [];

  /*
   * @description Create new array from all unique matches of token against baseFile, filter to those with an environment variable, then replace string in baseFile
   *
   * @todo Swap with a secret store that's not Travis Env Vars
   */
  const replacements = Array.from(new Set(baseFile.match(token))).filter(replacement => {
    // Filters any found token that doesn't have an environment variable
    const found = process.env.hasOwnProperty(new RegExp(token).exec(replacement)[1]);

    if (!found) {
      unused.push(replacement);
    }

    return found;
  }).map(replacement => {
    const replace = {};

    // Grabs the capture group from the found replacement token
    const found = new RegExp(token).exec(replacement)[1];

    // Stringifies the environment variable of the found replacement
    replace[replacement] = `${process.env[found]}`;

    // Replaces the token with its found value
    const find = new RegExp(`${replacement}`, 'g');
    baseFile = baseFile.replace(find, replace[replacement]);

    return replace;
  });

  // Compiles string YAML to JSON to ensure integrity not lost in conversion, then dumps to safe YAML string
  const manifestLoad = yaml.safeLoad(baseFile);
  const manifestFinal = yaml.safeDump(manifestLoad);

  // Outputs the file
  const manifestPath = path.join(process.cwd(), output);
  fs.outputFileSync(manifestPath, manifestFinal);

  return {
    manifest: manifestFinal,
    replacements,
    unused,
  };
}

/*
 * @description Runs the replacement if and only if this file is being run directly
 */
// Ignoring as there's no way to test this file and not have this fail
/* istanbul ignore next */
if (!module.parent) {
  // Run the manifest update
  const updated = updateManifest(program.manifest, program.output);

  if (updated.unused.length) {
    // Log out any tokens that weren't replaced
    console.log(`The following tokens were not replaced: ${updated.unused.join(', ')}`); // eslint-disable-line no-console
  }
}

module.exports = updateManifest;
