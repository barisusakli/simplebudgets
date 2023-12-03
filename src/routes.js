'use strict';

const controllers = require('./controllers');

const {
	generateToken,
	csrfSynchronisedProtection,
} = require('./csrf');

function ensureLoggedIn(req, res, next) {
	if (!req.user) {
		return res.status(403).send('Not allowed');
	}
	next();
}

module.exports = function (app) {
	app.get('/csrf-token', (req, res) => res.send(generateToken(req)));

	app.get('/service-worker.js', controllers.serviceWorker);

	app.post('/register', csrfSynchronisedProtection, controllers.register);
	app.post('/login', csrfSynchronisedProtection, controllers.login);
	app.post('/logout', csrfSynchronisedProtection, controllers.logout);
	app.get('/user', controllers.getUser);

	app.get('/budgets', ensureLoggedIn, controllers.getBudgets);
	app.get('/transactions', ensureLoggedIn, controllers.getTransactions);

	const middlewares = [ensureLoggedIn, csrfSynchronisedProtection];
	app.post('/budgets/create', middlewares, controllers.createBudget);
	app.post('/budgets/delete', middlewares, controllers.deleteBudget);
	app.post('/budgets/edit', middlewares, controllers.editBudget);
	app.post('/transactions/create', middlewares, controllers.createTransaction);
	app.post('/transactions/delete', middlewares, controllers.deleteTransaction);
	app.post('/transactions/edit', middlewares, controllers.editTransaction);
};
