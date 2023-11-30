

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
        console.log(response.statusText, response.body)
        if (!response.ok) {
            throw new Error(response.body)
        }
        const result = await response.json();
        console.log("Success:", result);
        return result;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}