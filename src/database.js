'use strict';

const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let db = null;
let client = null;

exports.connect = async function (uri) {
	client = await mongoClient.connect(
		uri,
		{}
	);

	db = client.db();
	db.collection('budgets').createIndex({ uid: 1, name: 1 }, { unique: true, background: true });
	db.collection('transactions').createIndex({ uid: 1, date: 1, budget: 1 }, { background: true });
	db.collection('users').createIndex({ email: 1 }, { unique: true, background: true });
	db.collection('userSessions').createIndex({ uid: 1 }, { background: true });
	db.collection('userSessions').createIndex({ sid: 1 }, { background: true });
	db.collection('passwordresets').createIndex({ code: 1 }, { background: true });
	db.collection('passwordresets').createIndex({ email: 1 }, { unique: true, background: true });
	db.collection('passwordresets').createIndex({ expireAt: 1 }, { expireAfterSeconds: 600, background: true });
	console.info('db connected');
};

exports.db = function () {
	if (!db) {
		throw new Error('database not connected');
	}
	return db;
};

exports.getClient = function () {
	return client;
};

exports.close = async function () {
	if (client) {
		await client.close();
		client = null;
		db = null;
	}
};
