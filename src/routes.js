module.exports = function (app) {
	// TODO: move all routes here
	// TODO: add csrf to post routes
	app.post('/register', function (req, res) {
		console.log(req.body);
		// TODO register
		res.json('ok');
	});

	app.post('/login', function (req, res) {
		console.log(req.body);
		res.json('ok');
	});

	app.post('/logout', function (req, res) {
		console.log(req.body);
		res.json('ok');
	});
}