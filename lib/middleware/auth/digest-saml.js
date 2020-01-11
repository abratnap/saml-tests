'use strict';

const { logger } = require('../../utils');
const DOM = require('xmldom').DOMParser;
const xpath = require('xpath');
const { set } = require('lodash');

/**
 * @module
 * @description This ensures that the SAML response from IDP after authentication is proper to consume by `pasport-saml` module, by adding  namespace attributes for `SignedInfo` and `Assertion` XML elements.
 *
 * @param {object} req - Request Object
 * @param {object} res - Response Object
 * @param {function} next - next handler function
 *
 * @returns {function} - the result of calling next route handler function
 */
module.exports = (req, res, next) => {
  try {
    const xmlData = Buffer.from(req.body.SAMLResponse, 'base64').toString('utf8');
    const doc = new DOM().parseFromString(xmlData);
    const signedInfos = xpath.select("//*[local-name()='SignedInfo']", doc);
    const assertions = xpath.select("//*[local-name()='Assertion']", doc);

    assertions.forEach((assertion) => {
      assertion.setAttribute(
        'xmlns:saml',
        'urn:oasis:names:tc:SAML:2.0:assertion'
      );
      assertion.setAttribute(
        'xmlns:xs',
        'http://www.w3.org/2001/XMLSchema'
      );
      assertion.setAttribute(
        'xmlns:xsi',
        'http://www.w3.org/2001/XMLSchema-instance'
      );
    });
    signedInfos.forEach((signedInfo) => {
      signedInfo.setAttribute(
        'xmlns:ds',
        'http://www.w3.org/2000/09/xmldsig#'
      );
    });

    set(req, 'body.SAMLResponse', new Buffer(doc.toString(), 'utf8').toString('base64'));
  }
  catch (error) {
    // Presuming bad SAMLResponse just passing through
    logger.info(error);
  }

  return next();
};
