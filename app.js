const express = require('express')
const path = require('path');
const app = express()
const bodyParser = require('body-parser')
const mongodb = require('mongodb');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

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
}

connectToDb();


app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, 'index.html'));
})

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
	txs.forEach((tx) => {
		if (tx) {
			tx.amountDollars = (tx.amount / 100).toFixed(2);
			tx.dateString = tx.date;
		}
	})
	res.json(txs);
});

app.post('/budgets/create', async (req, res) => {
	await db.collection('budgets').insertOne({
		name: req.body.name,
		amount: req.body.amount,
	})
	res.json('ok');
});

app.post('/transactions/create', async (req, res) => {
	if (!req.body.date) {
		return res.status(500).json('invalid-date');
	}

	await db.collection('transactions').insertOne({
		description: req.body.description,
		budget: req.body.budget,
		amount: req.body.amount * 100,
		date: new Date(req.body.date),
	});
	res.json('ok');
});

app.post('/transactions/delete', async (req, res) => {
	await db.collection('transactions').deleteOne({
		_id: new mongodb.ObjectId(req.body._id),
	});
	res.json('ok');
});

app.listen(port, () => {
	console.log(`listening on port ${port}`)
});

app.use('/static', express.static(path.join(__dirname, 'public')));