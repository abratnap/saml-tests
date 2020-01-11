'use strict';

const config = require('config');
const winston = require('winston');
const leNode = require('le_node'); // eslint-disable-line no-unused-vars

// Remove default console and add it again to give it options
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, config.winston.console);


// for production, add new Logentries transport
/* istanbul ignore next */
if (config.winston.logentries) {
  winston.add(winston.transports.Logentries, config.winston.logentries);
}

module.exports = winston;
