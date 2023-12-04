import React, { useState, useRef, useEffect } from "react"
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"
import { Modal } from 'bootstrap'

export default function BudgetModal({ refreshAll, budgetData, onHidden }) {
	const [formData, setFormData] = useState({ ...budgetData })
	const [errorMsg, setErrorMsg] = useState('')
	const myModalEl = useRef(null)

	function onSubmit() {
		if (!formData.name || !formData.amount) {
			return
		}

		if (formData.name.length > 50) {
			setErrorMsg('Budget name too long')
			return
		}
		fetchJson({
			url: formData._id ?
				'/budgets/edit' :
				'/budgets/create',
			data: formData,
			method: 'post',
		}).then(() => {
			hideModal()
			refreshAll()
		})
	}

	function showModal() {
		const myModal = Modal.getOrCreateInstance(myModalEl.current)
		myModal.show()
	}

	function hideModal() {
		const myModal = Modal.getOrCreateInstance(myModalEl.current)
		myModal.hide()
	}

	useEffect(() =>{
		showModal()
		if (onHidden) {
			myModalEl.current.addEventListener('hidden.bs.modal', onHidden, { once: true })
		}
	}, [])

	return (
		<div ref={myModalEl} className="modal" tabIndex="-1">
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">{`${formData._id ? 'Edit Budget' : 'Create Budget'}`}</h5>
						<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
					</div>
					<div className="modal-body">
						<div className="mb-3">
							<label className="form-label">Name</label>
							<input className="form-control" type="text" name="name" value={formData.name} onChange={ev => formHandleChange(ev, setFormData)} autoComplete="off"/>
							{errorMsg && <p className="form-text text-danger">{errorMsg}</p>}
						</div>
						<div className="mb-3">
							<label className="form-label">Amount</label>
							<input className="form-control" type="number" min="0" step="any" name="amount" value={formData.amount} onChange={ev => formHandleChange(ev, setFormData)}/>
						</div>
					</div>
					<div className="modal-footer">
						<button type="button" className="btn btn-primary" onClick={onSubmit}>Save</button>
					</div>
				</div>
			</div>
		</div>
	)
}