const express = require('express')
const path = require('path');
const app = express()
const bodyParser = require('body-parser')
const mongodb = require('mongodb');

// Login/logout requires
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const connectMongo = require('connect-mongo');
const csrfSync = require('csrf-sync');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// cors ?
app.use(cors({
	origin: 'http://127.0.0.1:3000',
	credentials: true,
}))

const secret = "get me from config";
const twoweeksInSeconds = 1209600;

// for sessions
app.use(session({
	secret: secret,
	resave: false,
	saveUninitialized: false,
	store: connectMongo.create({
		mongoUrl: `mongodb://127.0.0.1:27017/mybudget`
	}),
	cookie: {
		maxAge: twoweeksInSeconds * 1000,
	}
}))

app.use(cookieParser(secret))
app.use(passport.initialize())
app.use(passport.session())

const port = 3000

const mongoClient = mongodb.MongoClient;
let db = null;
async function connectToDb() {
	const mongodb = await mongoClient.connect(
		`mongodb://127.0.0.1:27017/mybudget`,
		{}
	);

	db = mongodb.db();
	// db.collection('budgets').createIndex({ name: 1, amount: 1 }, { background: true });
	db.collection('transactions').createIndex({ date: 1 }, { background: true });
	db.collection('users').createIndex({ email: 1 }, { unique: true, background: true });
}

function setupExpress() {
	require('./src/passportConfig')(db, passport);
	require('./src/routes')(app, db, passport);

	app.get('/budgets', async (req, res) => {
		const budgets = await db.collection('budgets').find({}).toArray();

		const { monthStart, monthEnd } = getMonthStartEnd(req.query.month, req.query.year);

		const txs = await db.collection('transactions').find({
			date: { $gte: monthStart, $lt: monthEnd }
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
		})

		budgets.forEach((budget) => {
			if (budget) {
				budget.current = budget.current || 0;
				budget.current = (budget.current / 100).toFixed(2);
				budget.percent =  parseFloat(((budget.current / budget.amount) * 100));
				budget.percentMonth = getMonthPercent();
				budget.bgColor = budget.percent < 100 ? 'bg-success' : 'bg-danger';
				budget.leftOrOver = (budget.amount - budget.current);
				if (budget.leftOrOver > 0) {
					budget.leftOrOver = `$${budget.leftOrOver.toFixed(2)} left`;
				} else if (budget.leftOrOver < 0) {
					budget.leftOrOver = `$${Math.abs(budget.leftOrOver).toFixed(2)} over`;
				}

				if (budget.percent > 95 && budget.percent < 100) {
					budget.bgColor = 'bg-warning';
				}
			}
		})

		res.json(budgets);
	})


	app.get('/transactions', async (req, res) => {
		const { monthStart, monthEnd } = getMonthStartEnd(req.query.month, req.query.year);
		const txs = await db.collection('transactions').find({
			date: { $gte: monthStart, $lt: monthEnd }
		}).sort({
			date: -1,
		}).toArray();

		res.json(txs);
	});

	app.post('/budgets/create', async (req, res) => {
		await db.collection('budgets').insertOne({
			name: req.body.name,
			amount: req.body.amount,
		})
		res.json('ok');
	});

	function formatDollarsToCents(value) {
		value = (value + '').replace(/[^\d.-]/g, '');
		if (value && value.includes('.')) {
		  value = value.substring(0, value.indexOf('.') + 3);
		}

		return value ? Math.round(parseFloat(value) * 100) : 0;
	}

	app.post('/transactions/create', async (req, res) => {
		if (!req.body.date) {
			return res.status(500).json('invalid-date');
		}
		const newTx = {
			description: req.body.description,
			budget: req.body.budget,
			amount: formatDollarsToCents(req.body.amount),
			date: new Date(req.body.date),
		}
		await db.collection('transactions').insertOne(newTx);
		res.json('ok');
	});

	app.post('/transactions/delete', async (req, res) => {
		await db.collection('transactions').deleteOne({
			_id: new mongodb.ObjectId(req.body._id),
		});
		res.json('ok');
	});

	app.use(express.static("dist"));

	const DIST_DIR = path.join(__dirname, "dist");
	const HTML_FILE = path.join(DIST_DIR, "index.html");

	app.get('*', (req, res) => {
		res.sendFile(HTML_FILE);
	})

	app.listen(port, () => {
		console.log(`listening on port ${port}`)
	});
}

(async function() {
	await connectToDb();
	setupExpress();
})();


function getMonthStartEnd(month, year) {
	const startDate = new Date();
	if (year) {
		startDate.setUTCFullYear(year);
	}
	if (month) {
		startDate.setUTCMonth(month);
	}
	startDate.setUTCDate(1);
	startDate.setUTCHours(0, 0, 0, 0);

	const endDate = new Date();
	if (year) {
		endDate.setUTCFullYear(year);
	}
	if (month) {
		endDate.setUTCMonth(month);
	}
	endDate.setUTCMonth(endDate.getUTCMonth() + 1, 1);
	endDate.setUTCHours(0, 0, 0, 0);

	return {
		monthStart: startDate,
		monthEnd: endDate,
	};
}

function daysInThisMonth() {
	const now = new Date();
	return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function getMonthPercent() {
	return parseFloat((new Date().getDate() / daysInThisMonth()) * 100);
}
