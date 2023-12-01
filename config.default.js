'use strict';

const twoweeksInSeconds = 1209600;

module.exports = {
	port: 3000,
	dbConnectionString: 'mongodb://127.0.0.1:27017/mybudget',
	secret: 'get me from config',
	sessionKey: 'simplebudget.sid',
	cookie: {
		path: '/',
		maxAge: twoweeksInSeconds * 1000,
	},
};
