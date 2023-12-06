'use strict';

const twoweeksInSeconds = 1209600;

module.exports = {
	url: 'https://simplebudgets.ca',
	port: 3000,
	dbConnectionString: 'mongodb://127.0.0.1:27017/mybudget',
	secret: 'get me from config',
	sessionKey: 'simplebudgets.sid',
	cookie: {
		path: '/',
		maxAge: twoweeksInSeconds * 1000,
	},
	sendgrid: {
		from: {
			email: 'support@simplebudgets.ca',
			name: 'SimpleBudgets.ca',
		},
		key: 'add sendgrid key',
	},
	hcaptcha: {
		sitekey: 'enter hcatpcha site key',
		secret: 'enter hcatpcha secret',
	},
};
