'use strict';


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
	app.get('/csrf-token', (req, res) => res.send(generateToken(req)));

	app.get('/service-worker.js', controllers.serviceWorker);

	app.post('/register', csrfSynchronisedProtection, tryRoute(controllers.register));
	app.post('/login', csrfSynchronisedProtection, tryRoute(controllers.login));
	app.post('/logout', csrfSynchronisedProtection, tryRoute(controllers.logout));
	app.post('/email/change', [ensureLoggedIn, csrfSynchronisedProtection], tryRoute(controllers.changeEmail));
	app.post('/password/change', [ensureLoggedIn, csrfSynchronisedProtection], tryRoute(controllers.changePassword));
	app.post('/password/reset/send', csrfSynchronisedProtection, tryRoute(controllers.passwordResetSend));
	app.post('/password/reset/commit', csrfSynchronisedProtection, tryRoute(controllers.passwordResetCommit));
	app.get('/user', tryRoute(controllers.getUser));

	app.get('/budgets', ensureLoggedIn, tryRoute(controllers.getBudgets));
	app.get('/transactions', ensureLoggedIn, tryRoute(controllers.getTransactions));

	const middlewares = [ensureLoggedIn, csrfSynchronisedProtection];
	app.post('/budgets/create', middlewares, tryRoute(controllers.createBudget));
	app.post('/budgets/delete', middlewares, tryRoute(controllers.deleteBudget));
	app.post('/budgets/edit', middlewares, tryRoute(controllers.editBudget));
	app.post('/transactions/create', middlewares, tryRoute(controllers.createTransaction));
	app.post('/transactions/delete', middlewares, tryRoute(controllers.deleteTransaction));
	app.post('/transactions/edit', middlewares, tryRoute(controllers.editTransaction));
};
