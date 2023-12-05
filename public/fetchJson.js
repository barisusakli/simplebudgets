

export default async function xhrJson({ url, data, method}) {
	try {
		const headers = {
			"Content-Type": "application/json",
		};
		method = method || 'get'
		if (['post', 'put', 'delete'].includes(method.toLowerCase())) {
			headers['x-csrf-token'] = await (await fetch('/csrf-token')).text()
		}
		const response = await fetch(url, {
			method: method,
			headers: headers,
			credentials: 'include',
			body: data ? JSON.stringify(data) : undefined,
		});

		const contentType = response.headers.get('content-type');
		const isJSON = contentType && contentType.startsWith('application/json');

		let result;
		if (method !== 'head') {
			if (isJSON) {
				result = await response.json();
			} else {
				result = await response.text();
			}
		}

		if (!response.ok) {
			if (result) {
				throw new Error(result);
			}
			throw new Error(res.statusText);
		}
		return result;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}