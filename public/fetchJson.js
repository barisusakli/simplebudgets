

export default async function xhrJson({ url, data, method}) {
	try {
		const response = await fetch(url, {
			method: method,
			headers: {
				"Content-Type": "application/json",
			},
			credentials: 'include',
			body: data ? JSON.stringify(data) : undefined,
		});

		const { headers } = response;
		const contentType = headers.get('content-type');
		const isJSON = contentType && contentType.startsWith('application/json');

		let result;
		if (method !== 'head') {
			if (isJSON) {
				result = await response.json();
			} else {
				result = await response.text();
			}
		}
		console.log('result', result);
		if (!response.ok) {
			if (result) {
				throw new Error(isJSON ? result : result);
			}
			throw new Error(res.statusText);
		}
		return result;
	} catch (error) {
		console.error("Error:", error);
		throw error;
	}
}