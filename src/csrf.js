'use strict';

const { csrfSync } = require('csrf-sync');

const {
	generateToken,
	csrfSynchronisedProtection,
	isRequestValid,
} = csrfSync();

module.exports = {
	generateToken,
	csrfSynchronisedProtection,
	isRequestValid,
};
