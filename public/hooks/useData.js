import { useState, useEffect, useReducer } from 'react';
import useAlert from './useAlert';

const dataFetchReducer = (state, action) => {
	switch (action.type) {
		case 'FETCH_LOADING':
			return { ...state, state: 'loading', data: null };
		case 'FETCH_SUCCESS':
			return { ...state, state: 'success', data: action.payload };
		case 'FETCH_ERROR':
			return { ...state, state: 'error', error: action.error };
		default:
			throw new Error('unknown type');
	}
};

export default function useData(initialUrl, initialData) {
	const [url, setUrl] = useState(initialUrl);
	const [state, dispatch] = useReducer(dataFetchReducer, {
		state: 'idle',
		data: initialData,
		error: '',
	});
	const { setAlert } = useAlert();
	useEffect(() => {
		if (!url) return;
		let ignore = false;
		async function fetchData() {
			dispatch({ type: 'FETCH_LOADING' });
			try {
				const res = await fetch(url);
				const payload = await res.json();
				if (!ignore) {
					if (res.ok) {
						dispatch({ type: 'FETCH_SUCCESS', payload });
					} else {
						throw new Error(payload);
					}
				}
			} catch (err) {
				if (!ignore) {
					dispatch({ type: 'FETCH_ERROR', error: err });
					setAlert(err.message, 'danger');
				}
			}
		}
		fetchData();
		return () => {
			ignore = true;
		};
	}, [url, setAlert]);

	function setData(payload) {
		dispatch({ type: 'FETCH_SUCCESS', payload });
	}

	return [state, { setUrl, setData }];
}
