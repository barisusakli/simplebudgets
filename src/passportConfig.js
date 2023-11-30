const mongodb = require('mongodb');
const bcryptjs = require('bcryptjs');
const localStrategy = require('passport-local').Strategy;

module.exports = function (passport, db) {
    passport.use(new localStrategy({
        passReqToCallback: true,
        usernameField: 'email',
        passwordField: 'password',
    }, async function (req, email, password, done) {
        console.log('in local');
        console.log(email, password)
        const user = await db.collection('users').findOne({
            email: email,
        });
        if (!user) {
            // done(new Error('user does not exist'))
            done(null, false)
            return;
        }
        const ok = await bcryptjs.compare(password, user.password);
        if (!ok) {
            done(new Error('password incorrect'));
            return
        }
        done(null, user);
    }));

    passport.serializeUser((user, cb) => {
        console.log('serialize', user);
        cb(null, user._id);
    })

    passport.deserializeUser((id, cb) => {
        console.log('deseri', id);
        db.collection('users').findOne({
            _id: new mongodb.ObjectId(id)
        }).then((result) => {
            console.log('epic fail', result);
            cb(null, result);
        })
    })
};