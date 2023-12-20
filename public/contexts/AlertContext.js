import React, { createContext, useState, useCallback, useMemo } from 'react';

const ALERT_TIME = 5000;
const initialState = {
	text: '',
	type: '',
};

const AlertContext = createContext({
	...initialState,
	setAlert: () => {},
});

export const AlertProvider = ({ children }) => {
	const [text, setText] = useState('');
	const [type, setType] = useState('');

	const setAlert = useCallback((text, type) => {
		setText(text);
		setType(type);

		setTimeout(() => {
			setText('');
			setType('');
		}, ALERT_TIME);
	}, []);

	const alertCtx = useMemo(() => ({
		text,
		type,
		setAlert,
	}), [text, type, setAlert]);

	return (
		<AlertContext.Provider
			value={alertCtx}
		>
			{children}
		</AlertContext.Provider>
	);
};

export default AlertContext;
