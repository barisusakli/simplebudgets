'use strict';

const test = require('node:test');
const assert = require('node:assert');

const { request } = require('./helpers/request');

const { start, close } = require('../server');

let server;
let port;

test.before(async () => {
	server = await start();
	port = server.address().port;
});

test.after(async () => {
	if (server) {
		await new Promise((resolve) => {
			server.close(resolve);
		});
	}
	await close();
});

test('POST /register creates a new user', async () => {
	const email = `tester_${Date.now()}@example.com`;
	const password = 'supersecret';

	const csrf = await request('GET', '/api/csrf-token', { port });
	assert.strictEqual(csrf.status, 200, 'csrf-token endpoint should respond 200');
	const register = await request('POST', '/api/register', {
		cookie: csrf.cookie,
		csrfToken: csrf.body,
		port,
		body: {
			email,
			password,
		},
	});
	assert.strictEqual(register.status, 200, 'register should respond 200');
	const payload = JSON.parse(register.body);
	assert.strictEqual(payload.email, email, 'response email should match registered email');
	assert.ok(new Date(payload.joined).toString() !== 'Invalid Date', 'joined should be a valid date');
});

test('POST /login authenticates a registered user', async () => {
	const email = `login_tester_${Date.now()}@example.com`;
	const password = 'supersecret';

	// login requires an existing user, so register one first
	const registerCsrf = await request('GET', '/api/csrf-token', { port });
	await request('POST', '/api/register', {
		cookie: registerCsrf.cookie,
		csrfToken: registerCsrf.body,
		port,
		body: { email, password },
	});

	const csrf = await request('GET', '/api/csrf-token', { port });
	assert.strictEqual(csrf.status, 200, 'csrf-token endpoint should respond 200');
	const login = await request('POST', '/api/login', {
		cookie: csrf.cookie,
		csrfToken: csrf.body,
		port,
		body: { email, password },
	});
	assert.strictEqual(login.status, 200, 'login should respond 200');
	const payload = JSON.parse(login.body);
	assert.strictEqual(payload.email, email, 'response email should match logged-in email');
	assert.ok(new Date(payload.joined).toString() !== 'Invalid Date', 'joined should be a valid date');
});
