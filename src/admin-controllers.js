'use strict';

const mongodb = require('mongodb');
const db = require('./database').db();

async function adminAuth(req, res, next) {
	const adminUsers = await db.collection('adminusers').find({
		_id: new mongodb.ObjectId(req.user._id),
	}).toArray();

	if (adminUsers.length === 0) {
		return res.status(404).send('Not found');
	}

	next();
}

async function adminUsers(req, res) {
	const users = await db.collection('users').find({}).toArray();

	const enrichedUsers = await Promise.all(users.map(async (user) => {
		const [numTransactions, numBudgets] = await Promise.all([
			db.collection('transactions').countDocuments({ uid: user._id }),
			db.collection('budgets').countDocuments({ uid: user._id }),
		]);

		return { ...user, numTransactions, numBudgets };
	}));

	res.json({ users: enrichedUsers });
};

module.exports = {
	adminAuth,
	adminUsers,
};
