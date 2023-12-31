'use strict';

const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;

let db = null;

exports.connect = async function (uri) {
	const mongodb = await mongoClient.connect(
		uri,
		{}
	);

	db = mongodb.db();
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
