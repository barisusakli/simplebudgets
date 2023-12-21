import React, { useRef } from 'react';
import Modal from './Modal';

export default function ConfirmModal({
	title, onSubmit, children,
}) {
	const confirm = useRef(false);
	const myModalEl = useRef(null);

	function onHidden() {
		onSubmit(confirm.current);
	}

	function handleConfirm() {
		confirm.current = true;
		myModalEl.current.hide();
	}

	return (
		<Modal ref={myModalEl} onHidden={onHidden} backdrop="static">
			<div className="modal-header">
				<h5 className="modal-title">{title || 'TITLE'}</h5>
				<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div className="modal-body">
				{children}
			</div>
			<div className="modal-footer">
				<button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button>

				<button type="button" className="btn btn-primary" onClick={handleConfirm}>Confirm</button>
			</div>
		</Modal>
	);
}
