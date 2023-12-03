import React, { useState } from "react"
import FormModal from "./FormModal"
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"

export default function BudgetModal({ refreshAll, budgetData, onHidden }) {
	const [formData, setFormData] = useState({ ...budgetData });

	function onSubmit(modal) {
		if (!formData.name || !formData.amount) {
			return;
		}

		fetchJson({
			url: formData._id ?
				'/budgets/edit' :
				'/budgets/create',
			data: formData,
			method: 'post',
		}).then(() => {
			refreshAll()
			modal.hide();
		})
	}

	return (
		<FormModal
			id="budget-modal"
			title={`${formData._id ? 'Edit Budget' : 'Create Budget'}`}
			onSubmit={onSubmit}
			onHidden={onHidden}
			isOpen={true}
		>
			<div className="mb-3">
				<label className="form-label">Name</label>
				<input className="form-control" type="text" name="name" value={formData.name} onChange={ev => formHandleChange(ev, setFormData)} autoComplete="off"/>
			</div>
			<div className="mb-3">
				<label className="form-label">Amount</label>
				<input className="form-control" type="number" min="0" step="any" name="amount" value={formData.amount} onChange={ev => formHandleChange(ev, setFormData)}/>
			</div>
		</FormModal>
	)
}