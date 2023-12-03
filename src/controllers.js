'use strict';

const passport = require('passport');
const bcryptjs = require('bcryptjs');
const mongodb = require('mongodb');
const config = require('../config.default');

const db = require('./database').db();

function formatDollarsToCents(value) {
	value = String(value).replace(/[^\d.-]/g, '');
	if (value && value.includes('.')) {
		value = value.substring(0, value.indexOf('.') + 3);
	}

	return value ? Math.round(parseFloat(value) * 100) : 0;
}

exports.register = async function (req, res) {
	if (req.user) {
		return res.redirec('/');
	}
	const user = await db.collection('users').findOne({
		email: req.body.email,
	});
	if (user) {
		res.status(500).json('User already exists');
		return;
	}
	const salt = await bcryptjs.genSalt();
	const hashedPassword = await bcryptjs.hash(req.body.password, salt);
	const result = await db.collection('users').insertOne({
		email: req.body.email,
		password: hashedPassword,
	});

	req.login({ _id: result.insertedId, email: req.body.email }, (err) => {
		if (err) {
			return res.status(500).json(err.message);
		}

		res.json({ _id: req.user._id, email: req.user.email });
	});
};

exports.login = function (req, res, next) {
	if (req.user) {
		return res.redirect('/');
	}
	passport.authenticate('local', (err, user /* , info */) => {
		if (err) {
			return res.status(500).send(err.message);
		}
		if (!user) {
			return res.status(500).send('no user exists');
		}
		req.login(user, (err) => {
			if (err) {
				return res.status(500).json(err.message);
			}
			res.json({ _id: req.user._id, email: req.user.email });
		});
	})(req, res, next);
};

exports.logout = function (req, res, next) {
	req.logout((err) => {
		if (err) {
			return next(err);
		}
		res.json('ok');
	});
};

exports.getUser = (req, res) => {
	if (req.user) {
		res.json({ _id: req.user._id, email: req.user.email });
	} else {
		res.json(null);
	}
};

exports.getBudgets = async (req, res) => {
	const budgets = await db.collection('budgets').find({
		uid: req.user._id,
	}).toArray();

	const { monthStart, monthEnd } = req.query;
	const txs = await db.collection('transactions').find({
		uid: req.user._id,
		date: {
			$gte: new Date(parseInt(monthStart, 10)),
			$lt: new Date(parseInt(monthEnd, 10)),
		},
	}).toArray();

	let totalSpent = 0;

	txs.forEach((tx) => {
		const budget = budgets.find(b => b.name === tx.budget);
		if (budget) {
			budget.current = budget.current || 0;
			budget.current += tx.amount;
		}
		totalSpent += tx.amount;
	});

	budgets.unshift({
		name: 'Total',
		amount: budgets.reduce((curr, b) => curr + parseInt(b.amount, 10), 0),
		current: totalSpent,
	});

	budgets.forEach((budget) => {
		if (budget) {
			budget.current = budget.current || 0;
			budget.percent = parseFloat(((budget.current / budget.amount) * 100));
			budget.leftOrOver = (budget.amount - budget.current);
			budget.bgColor = budget.percent < 100 ? 'bg-success' : 'bg-danger';
			if (budget.percent > 95 && budget.percent < 100) {
				budget.bgColor = 'bg-warning';
			}
		}
	});

	res.json(budgets);
};

exports.createBudget = async (req, res) => {
	await db.collection('budgets').insertOne({
		name: req.body.name,
		amount: formatDollarsToCents(req.body.amount),
		uid: req.user._id,
	});
	res.json('ok');
};

exports.deleteBudget = async (req, res) => {
	await db.collection('budgets').deleteOne({
		_id: new mongodb.ObjectId(req.body._id),
		uid: req.user._id,
	});

	res.json('ok');
};

exports.editBudget = async (req, res) => {
	await db.collection('budgets').updateOne({
		_id: new mongodb.ObjectId(req.body._id),
		uid: req.user._id,
	}, {
		$set: {
			name: req.body.name,
			amount: formatDollarsToCents(req.body.amount),
		},
	});
	res.json('ok');
};

exports.getTransactions = async (req, res) => {
	const { monthStart, monthEnd } = req.query;

	const txs = await db.collection('transactions').find({
		uid: req.user._id,
		date: {
			$gte: new Date(parseInt(monthStart, 10)),
			$lt: new Date(parseInt(monthEnd, 10)),
		},
	}).sort({
		date: -1,
	}).toArray();

	res.json(txs);
};

exports.createTransaction = async (req, res) => {
	if (!req.body.budget || !req.body.date || !req.body.amount || !req.body.description) {
		return res.status(500).send('invalid-data');
	}
	// TODO: check if budget exists
	// TODO: trim description to 100 chars
	// TODO: check amount is number
	// TODO: check date is actually date

	await db.collection('transactions').insertOne({
		description: req.body.description,
		budget: req.body.budget,
		amount: formatDollarsToCents(req.body.amount),
		date: new Date(req.body.date),
		uid: req.user._id,
	});
	res.json('ok');
};

exports.deleteTransaction = async (req, res) => {
	await db.collection('transactions').deleteOne({
		_id: new mongodb.ObjectId(req.body._id),
		uid: req.user._id,
	});
	res.json('ok');
};

exports.editTransaction = async (req, res) => {
	await db.collection('transactions').updateOne({
		_id: new mongodb.ObjectId(req.body._id),
		uid: req.user._id,
	}, {
		$set: {
			description: req.body.description,
			budget: req.body.budget,
			amount: formatDollarsToCents(req.body.amount),
			date: new Date(req.body.date),
		},
	});
	res.json('ok');
};
