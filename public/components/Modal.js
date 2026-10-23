import React, { useRef, useEffect, useImperativeHandle } from 'react';
import { Modal } from 'bootstrap';

const MyModal = ({
	ref, children, onHidden, backdrop = true, className = '',
}) => {
	const modalRef = useRef(null);

	useImperativeHandle(ref, () => ({
		hide() {
			const myModal = Modal.getOrCreateInstance(modalRef.current);
			myModal.hide();
		},
	}), []);

	useEffect(() => {
		const myModal = Modal.getOrCreateInstance(modalRef.current);
		myModal.show();
		const currentRef = modalRef.current;
		if (onHidden && currentRef) {
			currentRef.addEventListener('hidden.bs.modal', onHidden, { once: true });
		}
		return () => {
			if (onHidden && currentRef) {
				currentRef.removeEventListener('hidden.bs.modal', onHidden);
			}
		};
	}, [onHidden]);

	return (
		<div ref={modalRef} className={`modal ${className}`} tabIndex="-1" data-bs-backdrop={backdrop}>
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
