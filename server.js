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

const config = {
	port: 3000,
	dbConnectionString: 'mongodb://127.0.0.1:27017/mybudget',
	secret: 'get me from config',
};

function setupExpress() {
	const app = express();

	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(bodyParser.json());
	app.use(cors({
		origin: 'http://127.0.0.1:3000',
		credentials: true,
	}));

	const secret = 'get me from config';
	const twoweeksInSeconds = 1209600;

	// for sessions
	app.use(session({
		secret: secret,
		resave: false,
		saveUninitialized: false,
		store: connectMongo.create({
			mongoUrl: `mongodb://127.0.0.1:27017/mybudget`,
		}),
		cookie: {
			maxAge: twoweeksInSeconds * 1000,
		},
	}));

	app.use(cookieParser(secret));
	app.use(passport.initialize());
	app.use(passport.session());

	require('./src/passportConfig')(passport);
	require('./src/routes')(app);

	app.use(express.static('dist'));

	app.use((err, req, res, next) => {
		if (err.code === 'EBADCSRFTOKEN') {
			res.status(403).send('csrf-error');
			return;
		}
		next(err);
	});

	const DIST_DIR = path.join(__dirname, 'dist');
	const HTML_FILE = path.join(DIST_DIR, 'index.html');

	app.get('*', (req, res) => {
		res.sendFile(HTML_FILE);
	});

	app.listen(config.port, () => {
		console.log(`listening on port ${config.port}`);
	});
}

(async function () {
	await database.connect(config.dbConnectionString);
	setupExpress();
}());

