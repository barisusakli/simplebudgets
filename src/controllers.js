'use strict';

const validator = require('validator');
const util = require('util');
const path = require('path');
const passport = require('passport');
const bcryptjs = require('bcryptjs');
const mongodb = require('mongodb');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const hcaptcha = require('hcaptcha');
const config = require('../config');

const { sendgrid } = config;

sgMail.setApiKey(sendgrid.key);

const db = require('./database').db();

function formatDollarsToCents(value) {
	value = String(value).replace(/[^\d.-]/g, '');
	if (value && value.includes('.')) {
		value = value.substring(0, value.indexOf('.') + 3);
	}

	return value ? Math.round(parseFloat(value) * 100) : 0;
}

function validatePassword(password) {
	if (!password) {
		throw new Error('Invalid password');
	}
	if (password.length < 8) {
		throw new Error('Password too short');
	}
	if (password.length > 64) {
		throw new Error('Password too long');
	}
}

function validateEmail(email) {
	if (!email || !validator.isEmail(email)) {
		throw new Error('Invalid Email');
	}
	if (email.length > 254) {
		throw new Error('Email too long');
	}
}

async function validateCaptcha(token) {
	if (config.hcaptcha.secret) {
		const result = await hcaptcha.verify(config.hcaptcha.secret, token);
		if (!result.success) {
			throw new Error('hCaptcha Verification failed!');
		}
	}
}

async function hashPassword(password) {
	const salt = await bcryptjs.genSalt();
	return await bcryptjs.hash(password, salt);
}

async function destroySessions(uid) {
	const sids = await db.collection('userSessions').find({ uid }).toArray();
	await db.collection('sessions').deleteMany({
		_id: { $in: sids },
	});
	await db.collection('userSessions').deleteMany({ uid });
}

exports.serviceWorker = (req, res) => {
	res.status(200)
		.type('application/javascript')
		.set('Service-Worker-Allowed', `/`)
		.sendFile(path.join(__dirname, '../public/service-worker.js'));
};

exports.register = async function (req, res) {
	if (req.user) {
		return res.redirect('/');
	}

	await validateCaptcha(req.body.hcaptchaToken);

	const { email, password } = req.body;

	validateEmail(email);
	validatePassword(password);

	const hashedPassword = await hashPassword(password);
	let result;
	try {
		result = await db.collection('users').insertOne({
			email: email,
			password: hashedPassword,
		});
	} catch (err) {
		if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
			throw new Error('User already exists');
		}
		throw err;
	}
	const loginAsync = util.promisify(req.login).bind(req);
	await loginAsync({ _id: result.insertedId, email: email });
	res.json({
		email: req.user.email,
		joined: req.user._id.getTimestamp(),
	});
};


function authenticate(req, res) {
	return new Promise((resolve, reject) => {
		passport.authenticate('local', (err, user, info) => {
			if (err) reject(new Error(err));
			else if (!user) reject(new Error(info));
			resolve(user);
		})(req, res);
	});
}

exports.login = async function (req, res) {
	if (req.user) {
		return res.redirect('/');
	}

	await validateCaptcha(req.body.hcaptchaToken);

	const user = await authenticate(req, res);
	const loginAsync = util.promisify(req.login).bind(req);
	await loginAsync({ _id: user._id, email: user.email });
	await db.collection('userSessions').insertOne({
		uid: req.user._id,
		sid: req.sessionID,
	});
	res.json({
		email: req.user.email,
		joined: req.user._id.getTimestamp(),
	});
};

exports.logout = async function (req, res) {
	const sid = req.sessionID;
	const logoutAsync = util.promisify(req.logout).bind(req);
	await logoutAsync();
	await db.collection('userSessions').deleteOne({ sid });
	res.json('ok');
};

exports.changeEmail = async function (req, res) {
	const { password, email } = req.body;
	validateEmail(email);

	const user = await db.collection('users').findOne({
		_id: req.user._id,
	});

	if (!user) {
		throw new Error('No user');
	}

	const ok = await bcryptjs.compare(password, user.password);
	if (!ok) {
		throw new Error('Incorrect current password');
	}
	try {
		await db.collection('users').updateOne({
			_id: req.user._id,
		}, {
			$set: {
				email: email,
			},
		});
	} catch (err) {
		if (err.code === 11000 && err.keyPattern && err.keyPattern.email === 1) {
			throw new Error('Email already taken');
		}
		throw err;
	}
	await destroySessions(req.user._id);
	exports.logout(req, res);
};

exports.changePassword = async function (req, res) {
	const { password, newpassword } = req.body;

	const user = await db.collection('users').findOne({
		_id: req.user._id,
	});

	if (!user) {
		throw new Error('No user');
	}
	const ok = await bcryptjs.compare(password, user.password);
	if (!ok) {
		throw new Error('Incorrect current password');
	}
	validatePassword(newpassword);
	const hashedPassword = await hashPassword(newpassword);
	await db.collection('users').updateOne({
		_id: req.user._id,
	}, {
		$set: {
			password: hashedPassword,
		},
	});
	await destroySessions(req.user._id);
	exports.logout(req, res);
};

exports.passwordResetSend = async function (req, res, next) {
	const { email } = req.body;
	if (!email || !validator.isEmail(req.body.email)) {
		return next(new Error('Invalid email'));
	}
	const userColl = db.collection('users');
	const resetColl = db.collection('passwordresets');
	const user = await userColl.findOne({
		email: email,
	});
	if (!user) {
		setTimeout(() => {
			res.json('ok');
		}, Math.round((Math.random() * 100) + 100));
		return;
	}
	const resetObj = await resetColl.findOne({
		email: email,
	});

	const oneMinuteMs = 60000;
	if (resetObj && resetObj.code && Date.now() < resetObj.expireAt.getTime()) {
		return next(new Error('Reset email already sent, please wait 10 minutes to send another one!'));
	}
	const code = crypto.randomBytes(16).toString('hex');

	await sgMail.send({
		to: email,
		from: sendgrid.from,
		subject: 'Password reset request from SimpleBudgets.ca',
		html: `
			<p>Hello from Simple Budgets!</p>
			<p>We have received a password reset request for your account. If you didn't make this request please ignore this email.</p>
			<p>If you want to reset your password follow the link below.</p>
			<a href="${config.url}/reset/${code}">Reset my password</a>
			<p>Thank you!</p>
			<hr/>
			<a href="${config.url}">SimpleBudgets.ca</a>
		`,
	});

	await resetColl.updateOne({
		email: email,
	}, {
		$set: {
			uid: user._id,
			code,
			expireAt: new Date(Date.now() + (10 * oneMinuteMs)),
		},
	}, { upsert: true });

	res.json('ok');
};

exports.passwordResetCommit = async function (req, res, next) {
	const { code, password } = req.body;
	const userColl = db.collection('users');
	const resetColl = db.collection('passwordresets');
	const { email, uid, expireAt } = (await resetColl.findOne({ code }) || {});
	const isCodeValid = email && code && uid && expireAt.getTime() > Date.now();
	if (!isCodeValid) {
		return next(new Error('Invalid reset code'));
	}
	validatePassword(password);
	const hashedPassword = await hashPassword(password);
	await userColl.updateOne({
		email: email,
	}, {
		$set: {
			password: hashedPassword,
		},
	});
	await resetColl.deleteOne({ code });
	await db.collection('userSessions').deleteMany({ uid });
	res.json('ok');
};

exports.getUser = (req, res) => {
	if (req.user) {
		res.json({
			email: req.user.email,
			joined: req.user._id.getTimestamp(),
		});
	} else {
		res.json(null);
	}
};

function calculateCarryOverAmounts(budget, monthEndDate) {
	budget.amountAvailable = budget.amount;
	if (budget.carryover) {
		const now = new Date(monthEndDate.getTime());
		now.setMonth(now.getMonth() - 1);
		const budgetCreateDate = new Date(budget._id.getTimestamp());
		let monthsToUse = now.getMonth();
		if (budgetCreateDate.getFullYear() === now.getFullYear()) {
			// if budget was created this year only use available months,
			// ie, if budget is created in october and we are in december we have we months
			monthsToUse -= budgetCreateDate.getMonth();
		}
		monthsToUse += 1; // jan is 0, dec is 11, add 1 to get actual month count
		budget.amountAvailable *= monthsToUse;
	}
}

async function getTxsForBudgets(uid, start, end, budgets) {
	if (!budgets.length) {
		return [];
	}
	const txs = await db.collection('transactions').find({
		uid,
		date: {
			$gte: start,
			$lt: end,
		},
		budget: {
			$in: budgets.map(b => b._id),
		},
	}).toArray();
	return txs;
}

exports.getBudgets = async (req, res) => {
	const budgets = await db.collection('budgets').find({
		uid: req.user._id,
	}).sort({ _id: 1 }).toArray();

	const carryOverBudgets = budgets.filter(b => b.carryover);
	const monthlyBudgets = budgets.filter(b => !b.carryover);

	const { monthStart, monthEnd } = req.query;
	const selectedYear = new Date(parseInt(req.query.monthStart, 10)).getFullYear();
	const monthStartDate = new Date(parseInt(monthStart, 10));
	const monthEndDate = new Date(parseInt(monthEnd, 10));
	const yearStartDate = new Date(selectedYear, 0, 1);
	const yearEndDate = new Date(selectedYear + 1, 0, 0)

	budgets.forEach(b => calculateCarryOverAmounts(b, monthEndDate));

	const [monthlyTxs, carryOverTxs, allMonthTxs, transactionOptions] = await Promise.all([
		getTxsForBudgets(req.user._id, monthStartDate, monthEndDate, monthlyBudgets),
		getTxsForBudgets(req.user._id, yearStartDate, monthEndDate, carryOverBudgets),
		db.collection('transactions').find({
			uid: req.user._id,
			date: {
				$gte: new Date(parseInt(monthStart, 10)),
				$lt: new Date(parseInt(monthEnd, 10)),
			},
		}).sort({
			date: -1,
		}).toArray(),
		getTxsOptions(req.user._id, yearStartDate, yearEndDate),
	]);

	allMonthTxs.forEach((tx) => {
		const budget = budgets.find(b => tx.budget.equals(b._id));
		if (budget && budget.type) {
			tx.type = budget.type;
			tx.budgetName = budget.name;
		}
	});

	carryOverTxs.forEach((tx) => {
		tx.isInThisMonth = !!allMonthTxs.find(mtx => mtx._id.equals(tx._id));
	});

	const txs = monthlyTxs.concat(carryOverTxs);

	let currentSpending = 0;
	let currentIncome = 0;
	txs.forEach((tx) => {
		const budget = budgets.find(b => tx.budget.equals(b._id));
		if (budget) {
			budget.current = budget.current || 0;
			budget.current += tx.amount;
			if (budget.type === 'expense' && (!budget.carryover || tx.isInThisMonth)) {
				currentSpending += tx.amount;
			} else if (budget.type === 'income') {
				currentIncome += tx.amount;
			}
		}
	});
	const totalSpending = budgets.filter(b => b.type === 'expense').reduce((acc, b) => acc + parseInt(b.amount, 10), 0);
	const totalIncome = budgets.filter(b => b.type === 'income').reduce((acc, b) => acc + parseInt(b.amount, 10), 0);

	budgets.forEach((budget) => {
		if (budget) {
			budget.current = budget.current || 0;
			budget.percent = parseFloat(((budget.current / budget.amountAvailable) * 100));
			budget.leftOrOver = (budget.amountAvailable - budget.current);
			budget.bgColor = budget.percent < 100 ? 'bg-success' : 'bg-danger';
			if (budget.percent > 95 && budget.percent < 100) {
				budget.bgColor = 'bg-warning';
			}
		}
	});

	res.json({
		currentIncome,
		totalIncome,
		currentSpending,
		totalSpending,
		budgets,
		transactions: allMonthTxs,
		transactionOptions,
	});
};

async function getTxsOptions(uid, yearStartDate, yearEndDate) {
	const txs = await db.collection('transactions').find({
		uid: uid,
		date: {
			$gte: yearStartDate,
			$lt: yearEndDate,
		},
	}).sort({
		date: -1,
	}).toArray();
	const months = [
		'January', 'February', 'March', 'April', 'May', 'June',
		'July', 'August', 'September', 'October', 'November', 'December',
	];
	const counts = {};
	txs.forEach((tx) => {
		const month = tx.date.getMonth();
		counts[month] = counts[month] || 0;
		counts[month] += 1;
	});

	return months.map((name, i) => ({
		value: i,
		name: name,
		count: counts[i] || 0,
	}));
}

exports.createBudget = async (req, res) => {
	const { name, type } = req.body;
	if (!name) {
		throw new Error('Invalid budget name');
	}
	if (name.length > 50) {
		throw new Error('Budget name too long');
	}
	if (type !== 'income' && type !== 'expense') {
		throw new Error('Invalid budget type, must be expense or income');
	}
	await db.collection('budgets').insertOne({
		uid: req.user._id,
		name: name,
		amount: formatDollarsToCents(req.body.amount),
		carryover: parseInt(req.body.carryover, 10) || 0,
		type: req.body.type,
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
			carryover: parseInt(req.body.carryover, 10) || 0,
			type: req.body.type,
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

function validateBudgetDescription(body) {
	const { budget, description } = body;
	if (budget.length > 50) {
		throw new Error('Budget names can not be longer than 50 characters');
	}
	if (description.length > 100) {
		throw new Error('Descriptions can not be longer than 100 characters');
	}
}

exports.createTransaction = async (req, res) => {
	if (!req.body.budget || !req.body.date || !req.body.amount || !req.body.description) {
		throw new Error('Invalid data');
	}

	validateBudgetDescription(req.body);

	await db.collection('transactions').insertOne({
		description: req.body.description,
		budget: new mongodb.ObjectId(req.body.budget),
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
	validateBudgetDescription(req.body);

	await db.collection('transactions').updateOne({
		_id: new mongodb.ObjectId(req.body._id),
		uid: req.user._id,
	}, {
		$set: {
			description: req.body.description,
			budget: new mongodb.ObjectId(req.body.budget),
			amount: formatDollarsToCents(req.body.amount),
			date: new Date(req.body.date),
		},
	});
	res.json('ok');
};
