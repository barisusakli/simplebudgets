import React from 'react';
import useAlert from '../hooks/useAlert';

const AlertPopup = () => {
	const { text, type, setAlert } = useAlert()
	if (text && type) {
		return (
			<div className={`position-absolute end-0 bottom-0 mb-3 mx-3 text-break alert alert-${type} alert-dismissible fade show`} role="alert">
				{text}
				<button type="button" className="btn-close" onClick={() => setAlert('', '')} aria-label="Close"></button>
			</div>
		)
	} else {
		return <></>;
  	}
};

export default AlertPopup;