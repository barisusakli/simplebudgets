import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Modal } from 'bootstrap';

const MyModal = forwardRef(({
	children, onHidden, backdrop = true, className = '',
}, ref) => {
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
});

MyModal.displayName = 'My Modal';

export default MyModal;
