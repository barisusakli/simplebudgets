import React, { useEffect, useRef } from "react"
import { Modal } from 'bootstrap'

export default function ConfirmModal({
	title, onSubmit, children,
}) {
	const confirm = useRef(false)
	const myModalEl = useRef(null)

	useEffect(() => {
		const myModal = Modal.getOrCreateInstance(myModalEl.current)
		myModal.show()
		myModalEl.current.addEventListener('hidden.bs.modal', () => {
			onSubmit(confirm.current);
		}, { once: true })
	}, [])

	function handleConfirm() {
		confirm.current = true
		const myModal = Modal.getOrCreateInstance(myModalEl.current)
		myModal.hide()
	}

	return (
		<div ref={myModalEl} className="modal" tabIndex="-1" data-bs-backdrop="static">
			<div className="modal-dialog">
				<div className="modal-content">
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
				</div>
			</div>
		</div>
	)
}