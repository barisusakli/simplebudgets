'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

// Login/logout requires
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const database = require('./src/database');

const config = require('./config.default');

function setupExpress() {
	const app = express();
	app.use(`/apple-touch-icon`, (req, res) => {
		const iconPath = path.join(__dirname, 'assets/favicon/apple-touch-icon.png');
		res.sendFile(iconPath, {
			maxAge: req.app.enabled('cache') ? 5184000000 : 0,
		});
	});

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(cors({
		origin: 'http://127.0.0.1:3000',
		credentials: true,
	}));

	// for sessions
	app.use(session({
		name: config.sessionKey,
		secret: config.secret,
		resave: false,
		saveUninitialized: false,
		store: connectMongo.create({
			mongoUrl: config.dbConnectionString,
		}),
		cookie: config.cookie,
	}));

	app.use(cookieParser(config.secret));
	app.use(passport.initialize());
	app.use(passport.session());

	require('./src/passportConfig')(passport);
	require('./src/routes')(app);

	app.use('/assets', express.static('assets'));

	const DIST_DIR = path.join(__dirname, 'assets/dist');
	const HTML_FILE = path.join(DIST_DIR, 'index.html');

	app.get('*', (req, res) => {
		res.sendFile(HTML_FILE);
	});

	app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
		if (err.code === 'EBADCSRFTOKEN') {
			res.status(403).send('csrf-error');
			return;
		}
		res.status(500).json(err.message);
	});

	app.listen(config.port, () => {
		console.log(`listening on port ${config.port}`);
	});
}

(async function () {
	await database.connect(config.dbConnectionString);
	setupExpress();
}());

