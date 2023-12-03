import React, { useState } from "react"
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"
import FormModal from "./FormModal"

export default function TransactionModal({ budgetOptions, refreshAll, txData, onHidden }) {
	const [formData, setFormData] = useState({ ...txData });

	function onSubmit(modal) {
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
			url: submitData._id ?
				'/transactions/edit' :
				'/transactions/create',
			data: submitData,
			method: 'post',
		}).then(() => {
			refreshAll()
			modal.hide()
		})
	}

	return (
		<FormModal
			id="tx-modal"
			title={`${formData._id ? 'Edit Transaction' : 'Create Transaction'}`}
			onSubmit={onSubmit}
			onHidden={onHidden}
			isOpen={true}
		>
			<div className="mb-3">
				<label className="form-label">Budget</label>
				<select className="form-select" name="budget" id="budget" value={formData.budget} onChange={ev => formHandleChange(ev, setFormData)}>
					${budgetOptions.map((opt, i) => <option key={i}>{opt}</option>)}
				</select>
			</div>
			<div className="mb-3">
				<label className="form-label">Description</label>
				<input className="form-control" type="text" name="description" value={formData.description} onChange={ev => formHandleChange(ev, setFormData)}/>
			</div>
			<div className="mb-3">
				<label className="form-label">Amount</label>
				<input className="form-control" type="number" min="1" step="any" name="amount" value={formData.amount} onChange={ev => formHandleChange(ev, setFormData)}/>
			</div>
			<div className="mb-3">
				<label className="form-label">Date</label>
				<input className="form-control" type="date" name="date" value={formData.date} onChange={ev => formHandleChange(ev, setFormData)}/>
			</div>
		</FormModal>
	)
}