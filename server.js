'use strict';

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');

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
	// app.use(favicon(path.join(__dirname, 'public', 'favicon', 'favicon.ico')));
	// app.use(`/apple-touch-icon`, (req, res) => {
	// 	const iconPath = path.join(__dirname, 'public/favicon/apple-touch-icon.png');
	// 	res.sendFile(iconPath, {
	// 		maxAge: req.app.enabled('cache') ? 5184000000 : 0,
	// 	});
	// });

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
			mongoUrl: `mongodb://127.0.0.1:27017/mybudget`,
		}),
		cookie: config.cookie,
	}));

	app.use(cookieParser(config.secret));
	app.use(passport.initialize());
	app.use(passport.session());

	require('./src/passportConfig')(passport);
	require('./src/routes')(app);

	app.use('/assets', express.static('assets/dist'));
	app.use('/assets/favicon', express.static('assets/favicon'));

	const DIST_DIR = path.join(__dirname, 'assets/dist');
	const HTML_FILE = path.join(DIST_DIR, 'index.html');

	app.get('*', (req, res) => {
		res.sendFile(HTML_FILE);
	});

	app.use((err, req, res, next) => {
		if (err.code === 'EBADCSRFTOKEN') {
			res.status(403).send('csrf-error');
			return;
		}
		next(err);
	});

	app.listen(config.port, () => {
		console.log(`listening on port ${config.port}`);
	});
}

(async function () {
	await database.connect(config.dbConnectionString);
	setupExpress();
}());

