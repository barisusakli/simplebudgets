import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { Modal } from 'bootstrap';

const MyModal = ({
	ref, children, onHidden, backdrop = true, className = '',
}) => {
	const myModalEl = useRef(null);

	useImperativeHandle(ref, () => ({
		hide() {
			const myModal = Modal.getOrCreateInstance(myModalEl.current);
			myModal.hide();
		},
	}), []);

	useEffect(() => {
		const myModal = Modal.getOrCreateInstance(myModalEl.current);
		myModal.show();
		if (onHidden) {
			myModalEl.current.addEventListener('hidden.bs.modal', onHidden, { once: true });
		}
	}, [onHidden]);

	return (
		<div ref={myModalEl} className={`modal ${className}`} tabIndex="-1" data-bs-backdrop={backdrop}>
			<div className="modal-dialog">
				<div className="modal-content">
					{children}
				</div>
			</div>
		</div>
	);
};

MyModal.displayName = 'My Modal';

export default MyModal;
