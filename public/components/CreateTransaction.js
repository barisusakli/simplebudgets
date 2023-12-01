import React, { useState } from "react"
import { Modal } from "bootstrap"
import fetchJson from "../fetchJson"

export default function CreateTransaction({ budgetOptions, refreshAll }) {
	const [modal, setModal] = useState(null)

	const options = budgetOptions.map((opt, i) => <option key={i}>{opt}</option>)

	function getYYYYmmdd() {
		const d = new Date();
		let month = '' + (d.getMonth() + 1);
		let day = '' + d.getDate();
		let year = d.getFullYear();

		if (month.length < 2)
			month = '0' + month;
		if (day.length < 2)
			day = '0' + day;

		return [year, month, day].join('-');
	}

	function newFormData() {
		return {
			budget: budgetOptions.length > 0 ? budgetOptions[0] : '',
			description: '',
			amount: 0,
			date: getYYYYmmdd(),
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
		const myModal = new Modal('#tx-modal', {});
		myModal.show()
		setModal(myModal);
	}

	function handleSubmit() {
		if (modal) {
			modal.hide();
		}
		if (!formData.budget || !formData.amount || !formData.description) {
			return
		}
		const newDate = new Date();
		const parts = formData.date.split('-');
		newDate.setFullYear(parts[0], parts[1] - 1, parts[2])
		const submitData = {
			...formData,
			date: newDate.getTime(),
		}

		fetchJson({
			url: '/transactions/create',
			data: submitData,
			method: 'post',
		}).then(() => {
			refreshAll()
			setFormData(newFormData())
			setModal(null);
		})
	}

	return (
		<div className="d-flex justify-content-end">
			<button id="create-transaction" className="btn btn-primary ff-secondary" onClick={handleCreate}>Add Transaction</button>
			<div className="modal" tabIndex="-1" id="tx-modal">
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
							<button type="button" className="btn btn-primary" onClick={handleSubmit}>Add</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}