'use strict';

function parseCookies(setCookie) {
	return (setCookie || []).map(entry => entry.split(';')[0]).join('; ');
}

async function request(method, path, { cookie, body, csrfToken, port } = {}) {
	const data = body ? JSON.stringify(body) : null;
	const headers = { 'Content-Type': 'application/json' };
	if (cookie) {
		headers.Cookie = cookie;
	}
	if (csrfToken) {
		headers['X-CSRF-Token'] = csrfToken;
	}

	const res = await fetch(`http://127.0.0.1:${port}${path}`, {
		method,
		headers,
		body: data,
	});

	let raw = '';
	try {
		raw = await res.text();
	} catch (err) {
		// fall back to empty body on unread/empty responses
	}

	return {
		status: res.status,
		body: raw,
		cookie: parseCookies(res.headers.getSetCookie ? res.headers.getSetCookie() : res.headers.get('set-cookie')),
	};
}

module.exports = { request };
