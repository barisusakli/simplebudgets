import React, { useState, useRef } from 'react';
import fetchJson from '../fetchJson';
import formHandleChange from '../formHandleChange';
import ConfirmModal from './ConfirmModal';
import Modal from './Modal';
import { getYYYYmmdd } from '../format';
import useAlert from '../hooks/useAlert';

export default function TransactionModal({ budgetOptions, refreshAll, txData, onHidden }) {
	const { setAlert } = useAlert();
	const [formData, setFormData] = useState({
		...txData,
		date: getYYYYmmdd(txData.date),
	});
	const [descriptionErrorMsg, setDescriptionErrorMsg] = useState('');
	const [deleteTransaction, setDeleteTransaction] = React.useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const myModalEl = useRef(null);

	function onSubmit() {
		if (!formData.budget || !formData.amount || !formData.description) {
			return;
		}
		if (formData.description.length > 100) {
			setDescriptionErrorMsg('Description too long');
			return;
		}
		setIsSubmitting(true);
		const newDate = new Date(txData.date);
		const parts = formData.date.split('-');
		newDate.setFullYear(parts[0], parts[1] - 1, parts[2]);

		const submitData = {
			...formData,
			date: newDate.getTime(),
		};

		fetchJson({
			url: submitData._id ?
				'/api/transactions/edit' :
				'/api/transactions/create',
			data: submitData,
			method: 'post',
		}).then(() => {
			myModalEl.current.hide();
			refreshAll();
		}).catch(err => setAlert(err.message, 'danger'));
	}

	function onDeleteClick() {
		setDeleteTransaction(txData);
	}

	function handleDelete(confirm, _id) {
		if (!confirm) {
			setDeleteTransaction(null);
			return;
		}
		fetchJson({
			url: '/api/transactions/delete',
			data: { _id },
			method: 'post',
		}).then(() => {
			setDeleteTransaction(null);
			myModalEl.current.hide();
			refreshAll();
		}).catch(err => setAlert(err.message, 'danger'));
	}

	return (
		<>
			<Modal ref={myModalEl} onHidden={onHidden} className={`${deleteTransaction ? 'd-none' : ''}`}>
				<div className="modal-header">
					<h5 className="modal-title">{`${formData._id ? 'Edit Transaction' : 'Add Transaction'}`}</h5>
					<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div className="modal-body">
					<div className="mb-3">
						<label className="form-label">Budget</label>
						<select className="form-select" name="budget" id="budget" value={formData.budget} onChange={ev => formHandleChange(ev, setFormData)}>
							${budgetOptions.map((opt, i) => <option key={i} value={opt._id}>{opt.name}</option>)}
						</select>
					</div>
					<div className="mb-3">
						<label className="form-label">Description</label>
						<input className="form-control" type="text" name="description" value={formData.description} onChange={ev => formHandleChange(ev, setFormData)}/>
						{descriptionErrorMsg && <p className="form-text text-danger">{descriptionErrorMsg}</p>}
					</div>
					<div className="mb-3">
						<label className="form-label">Amount</label>
						<input className="form-control" type="number" min="1" step="any" name="amount" value={formData.amount} onChange={ev => formHandleChange(ev, setFormData)}/>
					</div>
					<div className="mb-3">
						<label className="form-label">Date</label>
						<input className="form-control" type="date" name="date" value={formData.date} onChange={ev => formHandleChange(ev, setFormData)}/>
					</div>
				</div>
				<div className="modal-footer">
					{formData._id &&
						<button type="button" className="btn btn-outline-danger" onClick={onDeleteClick}>Delete</button>
					}
					<button type="button" className="btn btn-primary" onClick={onSubmit} disabled={isSubmitting}>Save</button>
				</div>
			</Modal>

			{deleteTransaction &&
			<ConfirmModal
				title="Confirm Transaction Delete"
				onSubmit={confirm => handleDelete(confirm, deleteTransaction._id)}
			>
				<div className="alert alert-danger">Do you really want to delete the <strong>"{deleteTransaction.description}"</strong> transaction?</div>
			</ConfirmModal>
			}
		</>
	);
}
