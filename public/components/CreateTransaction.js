import React, { useState } from "react"
import { Modal } from "bootstrap"
import fetchJson from "../fetchJson"

export default function CreateTransaction({ budgetOptions, refreshAll }) {
	const [modal, setModal] = useState(null)

	const options = budgetOptions.map((opt, i) => <option key={i}>{opt}</option>)

	function newFormData() {
		return {
			budget: '',
			description: '',
			amount: 0,
			date: new Date().toISOString().split('T')[0], // returns YYYY-mm-dd
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
		const myModal = new Modal('#myModal', {});
		myModal.show()
		setModal(myModal);
	}

	function handleAdd() {
		console.log('create', formData);
		if (modal) {
			modal.hide();
		}

		// create new tx
		fetchJson({
			url: '/transactions/create',
			data: formData,
			method: 'post',
		}).then((result) => {
			console.log('done', result)
			refreshAll()
			setFormData(newFormData())
			setModal(null);
		})
	}

	return (
		<div className="d-flex">
			<button id="create-transaction" className="btn btn-primary w-100" onClick={handleCreate}>Add Transaction</button>
			<div className="modal" tabIndex="-1" id="myModal">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<h5 className="modal-title">Create Transaction</h5>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="mb-3">
								<label className="form-label" htmlFor="budget">Budget</label>
								<select className="form-select" name="budget" value={formData.budget} onChange={handleChange}>${options}</select>
							</div>
							<div className="mb-3">
								<label className="form-label" htmlFor="description">Description</label>
								<input className="form-control" type="text" name="description" value={formData.description} onChange={handleChange}/>
							</div>
							<div className="mb-3">
								<label className="form-label" htmlFor="amount">Amount</label>
								<input className="form-control" type="text" name="amount" value={formData.amount} onChange={handleChange}/>
							</div>
							<div className="mb-3">
								<label className="form-label" htmlFor="date">Date</label>
								<input className="form-control" type="date" name="date" value={formData.date} onChange={handleChange}/>
							</div>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-primary" onClick={handleAdd}>Add</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}