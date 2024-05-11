export default async function customFetch(endpoint, params, init) {
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_PREFIX}${endpoint}?${new URLSearchParams(params)}`, init);

	if (response.ok) {
		try {
			const data = await response.json();
			return data;
		} catch (e) {
			return
		}
	}
	else {
		var errorObj = {
			errorCode: response.status,
			errorMessage: (await response.text())
		}

		if (errorObj.errorCode == 401)
			return errorObj

		throw new Error(JSON.stringify(errorObj))
	}
}