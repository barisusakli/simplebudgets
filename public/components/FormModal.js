import React, { useEffect } from "react"
import { Modal } from 'bootstrap'

export default function FormModal({
	id, title, isOpen, onHidden, onSubmit, children, submitTitle, showCloseButton
}) {

	function showModal() {
		const myModalEl = document.getElementById(id)
		const myModal = Modal.getOrCreateInstance(myModalEl)
		myModal.show()
		if (onHidden) {
			myModalEl.addEventListener('hidden.bs.modal', onHidden, { once: true })
		}
	}

	useEffect(() => {
		if (isOpen) {
			showModal()
		}
	}, [isOpen])

	function handleSubmit() {
		const myModalEl = document.getElementById(id)
		const myModal = Modal.getOrCreateInstance(myModalEl)
		onSubmit(myModal)
	}

	return (
		<div className="modal" tabIndex="-1" id={id}>
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
						{ showCloseButton && <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> }
						<button type="button" className="btn btn-primary" onClick={handleSubmit}>{ submitTitle || 'Save' }</button>
					</div>
				</div>
			</div>
		</div>
	)
}