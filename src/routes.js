'use strict';

const express = require('express');
const { csrfSync } = require('csrf-sync');
const controllers = require('./controllers');

const {
	generateToken,
	csrfSynchronisedProtection,
} = csrfSync();

function ensureLoggedIn(req, res, next) {
	if (!req.user) {
		return res.status(403).send('Not allowed');
	}
	next();
}

function tryRoute(controller) {
	if (controller && controller.constructor && controller.constructor.name === 'AsyncFunction') {
		return async function (req, res, next) {
			try {
				await controller(req, res, next);
			} catch (err) {
				next(err);
			}
		};
	}
	return controller;
}

module.exports = function (app) {
	const router = express.Router();
	router.get('/csrf-token', (req, res) => res.send(generateToken(req)));

	app.get('/service-worker.js', controllers.serviceWorker);

	router.post('/register', csrfSynchronisedProtection, tryRoute(controllers.register));
	router.post('/login', csrfSynchronisedProtection, tryRoute(controllers.login));
	router.post('/logout', csrfSynchronisedProtection, tryRoute(controllers.logout));
	router.post('/email/change', [ensureLoggedIn, csrfSynchronisedProtection], tryRoute(controllers.changeEmail));
	router.post('/password/change', [ensureLoggedIn, csrfSynchronisedProtection], tryRoute(controllers.changePassword));
	router.post('/password/reset/send', csrfSynchronisedProtection, tryRoute(controllers.passwordResetSend));
	router.post('/password/reset/commit', csrfSynchronisedProtection, tryRoute(controllers.passwordResetCommit));
	router.get('/user', tryRoute(controllers.getUser));

	router.get('/budgets', ensureLoggedIn, tryRoute(controllers.getBudgets));
	router.get('/transactions', ensureLoggedIn, tryRoute(controllers.getTransactions));

	const middlewares = [ensureLoggedIn, csrfSynchronisedProtection];
	router.post('/budgets/create', middlewares, tryRoute(controllers.createBudget));
	router.post('/budgets/delete', middlewares, tryRoute(controllers.deleteBudget));
	router.post('/budgets/edit', middlewares, tryRoute(controllers.editBudget));
	router.post('/transactions/create', middlewares, tryRoute(controllers.createTransaction));
	router.post('/transactions/delete', middlewares, tryRoute(controllers.deleteTransaction));
	router.post('/transactions/edit', middlewares, tryRoute(controllers.editTransaction));
	app.use('/api', router);
};
