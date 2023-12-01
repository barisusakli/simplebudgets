'use strict';

const mongodb = require('mongodb');
const bcryptjs = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

const db = require('./database').db();

module.exports = function (passport) {
	passport.use(new localStrategy({
		usernameField: 'email',
		passwordField: 'password',
	}, async (email, password, done) => {
		const user = await db.collection('users').findOne({
			email: email,
		});
		console.log('local str', user);
		if (!user) {
			done(null, false, 'user does not exist');
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
	});

	passport.deserializeUser((id, cb) => {
		db.collection('users').findOne({
			_id: new mongodb.ObjectId(id),
		}).then((result) => {
			if (!result) {
				return cb(new Error('cant find user to deserialize'));
			}
			cb(null, { _id: result._id, email: result.email });
		});
	});
};
