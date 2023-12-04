import React from "react"
import fetchJson from "../fetchJson"
import TransactionModal from "./TransactionModal"
import formatCentsToDollars from "../format"
import FormModal from "./FormModal"

export default function TransactionList({
	transactions, budgetOptions, refreshAll, currentBudget, setCurrentBudget
}) {
	const [txData, setTxData] = React.useState(null)
	const [deleteTransaction, setDeleteTransaction] = React.useState(null)

	const els = transactions
		.filter(tx => !currentBudget || tx.budget === currentBudget)
		.map((tx, i) => {
			return (
				<tr key={i} className={`bg-transition ${txData && txData._id == tx._id ? 'active-tx' : ''}`} role="button" onClick={() => handleEdit(tx)}>
					<td className="text-nowrap">{new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short'})}</td>
					<td>{tx.description}</td>
					<td>{tx.budget}</td>
					<td className="text-end">{formatCentsToDollars(tx.amount)}</td>
					<td className="text-end"><button onClick={(ev) => handleDeleteClick(ev, tx)} className="btn btn-sm btn-danger lh-1">X</button></td>
				</tr>
			)
		})


	function getYYYYmmdd(date) {
		let month = '' + (date.getMonth() + 1);
		let day = '' + date.getDate();
		let year = date.getFullYear();

		if (month.length < 2) {
			month = '0' + month;
		}
		if (day.length < 2) {
			day = '0' + day;
		}

		return [year, month, day].join('-');
	}

	function handleCreate() {
		setTxData({
			budget: budgetOptions.length > 0 ? budgetOptions[0] : '',
			description: '',
			amount: 0,
			date: getYYYYmmdd(new Date()),
		})
	}

	function handleEdit(tx) {
		setTxData({
			...tx,
			date: getYYYYmmdd(new Date(tx.date)),
			amount: (tx.amount / 100).toFixed(2),
		});
	}

	function handleDeleteClick(ev, tx) {
		ev.stopPropagation()
		setDeleteTransaction(tx)
	}

	function handleDelete(modal, _id) {
		fetchJson({
			url: '/transactions/delete',
			data: { _id },
			method: 'post',
		}).then(() => {
			refreshAll()
			modal.hide()
		})
	}

	return (
		<div className="mt-3 d-flex flex-column gap-3">
			<div className="d-flex justify-content-between gap-2">
				<button className="btn btn-primary ff-secondary text-nowrap" onClick={handleCreate}>Add Transaction</button>
				{txData && <TransactionModal
					budgetOptions={budgetOptions}
					refreshAll={refreshAll}
					txData={txData}
					onHidden={() => setTxData(null)}
				/>}

				{deleteTransaction && <FormModal
					id="delete-tx-confirm"
					title="Confirm Transaction Delete"
					onSubmit={modal => handleDelete(modal, deleteTransaction._id)}
					onHidden={() => setDeleteTransaction(null)}
					submitTitle="Delete"
					showCloseButton={true}
					isOpen={true}
					>
						<div className="alert alert-danger">Do you really want to delete the <strong>"{deleteTransaction.description}"</strong> transaction?</div>
					</FormModal>
				}
				<div>
					<select className="form-select" value={currentBudget} onChange={(ev) => setCurrentBudget(ev.target.value)}>
						<option value="">All bugdets</option>
						{budgetOptions.map((b, i) => <option key={i} value={b}>{b}</option>)}
					</select>
				</div>
			</div>

			{ transactions.length > 0 &&
				<div className="table-responsive">
					<table id="transaction-list" className="table table-hover table-sm">
						<thead>
							<tr>
								<th scope="col">Date</th>
								<th scope="col">Description</th>
								<th scope="col">Budget</th>
								<th scope="col" className="text-end">Amount</th>
								<th scope="col"></th>
							</tr>
						</thead>
						<tbody className="text-sm">{els}</tbody>
					</table>
				</div>
			}

			{transactions.length === 0 && <div className="alert alert-info text-center">You don't have any transactions. Start by clicking "Add Transaction".</div>}
		</div>
	)
}