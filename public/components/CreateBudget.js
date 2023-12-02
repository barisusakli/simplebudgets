import React, { useState } from "react"
import { Modal } from "bootstrap"
import fetchJson from "../fetchJson"

export default function CreateBudget({ refreshAll }) {
	const [modal, setModal] = useState(null)

	function newFormData() {
		return {
			name: '',
			amount: '',
		}
	}

	const [formData, setFormData] = useState(newFormData());

	function handleChange(ev) {
		const { name, value, type, checked } = ev.target;
		setFormData(prevData => ({
			...prevData,
			[name]: type === 'checkbox' ? checked : value
		}))
	}

	function handleCreate(ev) {
		ev.preventDefault();
		if (modal) {
			modal.show();
			return;
		}
		const myModal = new Modal('#budget-modal', {});
		myModal.show()
		setModal(myModal);
	}

	function handleSubmit() {
		if (!formData.name || !formData.amount) {
			return;
		}
		if (modal) {
			modal.hide();
		}

		fetchJson({
			url: '/budgets/create',
			data: formData,
			method: 'post',
		}).then(() => {
			refreshAll()
			setFormData(newFormData())
			setModal(null);
		})
	}

	return (
		<div className="d-flex">
			<button id="create-budget" className="btn btn-primary ff-secondary" onClick={handleCreate}>Create Budget</button>
			<div className="modal" tabIndex="-1" id="budget-modal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Create Budget</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label className="form-label">Name</label>
								<input className="form-control" type="text" name="name" value={formData.name} onChange={handleChange} autoComplete="off"/>
							</div>
							<div className="mb-3">
								<label className="form-label">Amount</label>
								<input className="form-control" type="text" name="amount" value={formData.amount} onChange={handleChange}/>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" onClick={handleSubmit}>Create</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}