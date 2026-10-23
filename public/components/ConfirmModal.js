import React, { useRef } from 'react';
import Modal from './Modal';

export default function ConfirmModal({
	title, onSubmit, children,
}) {
	const confirmRef = useRef(false);
	const modalRef = useRef(null);

	function onHidden() {
		onSubmit(confirmRef.current);
	}

	function handleConfirm() {
		confirmRef.current = true;
		modalRef.current.hide();
	}

	function handleCancel() {
		confirmRef.current = false;
		modalRef.current.hide();
	}

	return (
		<Modal ref={modalRef} onHidden={onHidden} backdrop="static">
			<div className="modal-header">
				<h5 className="modal-title">{title || 'TITLE'}</h5>
				<button type="button" className="btn-close" onClick={handleCancel} aria-label="Close"></button>
			</div>
			<div className="modal-body">
				{children}
			</div>
			<div className="modal-footer">
				<button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>Cancel</button>

				<button type="button" className="btn btn-primary" onClick={handleConfirm}>Confirm</button>
			</div>
		</Modal>
	);
}
