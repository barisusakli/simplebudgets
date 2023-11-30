const mongodb = require('mongodb');
const bcryptjs = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function (db, passport) {
	passport.use(new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
	}, async function (email, password, done) {
		const user = await db.collection('users').findOne({
			email: email,
		});
		if (!user) {
			done(null, false)
			return;
		}
		const ok = await bcryptjs.compare(password, user.password);
		if (!ok) {
			done(new Error('password incorrect'));
			return;
		}
		done(null, user);
	}));

	passport.serializeUser((user, cb) => {
		cb(null, user._id);
	})

	passport.deserializeUser((id, cb) => {
		db.collection('users').findOne({
			_id: new mongodb.ObjectId(id)
		}).then((result) => {
			cb(null, { _id: result._id, email: result.email });
		});
	})
};