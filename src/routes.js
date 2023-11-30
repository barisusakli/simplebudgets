const bcryptjs = require('bcryptjs')

module.exports = function (app, db, passport) {
	// TODO: move all routes here
	// TODO: add csrf to post routes
	app.post('/register', async function (req, res) {
		const user = await db.collection('users').findOne({
			email: req.body.email,
		});
		if (user) {
			res.status(500).json('User already exists')
			return;
		}
		const salt = await bcryptjs.genSalt();
		const hashedPassword = await bcryptjs.hash(req.body.password, salt);
		await db.collection('users').insertOne({
			email: req.body.email,
			password: hashedPassword,
		})

		res.json('ok');
	});

	app.post('/login', function (req, res, next) {
		passport.authenticate('local', (err, user, info) => {
			if (err) {
				return res.status(500).send(err.message)
			}
			if (!user) {
				return res.status(500).send('no user exists');
			}

			req.logIn(user, (err) => {
				if (err) {
					return res.status(500).json(err.message);
				}
				res.json('ok');
			});
		})(req, res, next)
	});

	app.post('/logout', function (req, res) {
		req.logout(() => {
			res.json('ok');
		})
	});

	app.get('/user', (req, res) => {
		console.log('get user', req.user);
		if (req.user) {
			res.json({ _id: req.user._id, email: req.user.email })
		} else {
			res.json(null);
		}
	})
}