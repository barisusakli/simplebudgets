import React from "react"
import fetchJson from "../fetchJson"
import CreateTransaction from "./CreateTransaction"
import formatCentsToDollars from "../format"

export default function TransactionList({
	transactions, budgetOptions, refreshAll, currentBudget, setCurrentBudget
}) {
	const [txEdit, setTxEdit] = React.useState(null)

	const els = transactions
		.filter(tx => !currentBudget || tx.budget === currentBudget)
		.map((tx, i) => {
			return (
				<tr key={i} className="pointer" role="button" onClick={() => handleTxEdit(tx)}>
					<td>{new Date(tx.date).toLocaleDateString('en-GB')}</td>
					<td>{tx.description}</td>
					<td>{tx.budget}</td>
					<td>{formatCentsToDollars(tx.amount)}</td>
					<td className="text-end"><button onClick={() => handleDelete(tx._id)} className="btn btn-sm btn-danger lh-1">X</button></td>
				</tr>
			)
		})

	function handleTxEdit(tx) {
		// TODO edit tx
		console.log(tx)
		setTxEdit(tx);
	}

	function handleDelete(_id) {
		fetchJson({
			url: '/transactions/delete',
			data: { _id },
			method: 'post',
		}).then(() => {
			refreshAll()
		})
	}

	return (
		<div className="mt-3 d-flex flex-column gap-3">
			<div className="d-flex justify-content-between gap-2">
				<CreateTransaction
					budgetOptions={budgetOptions}
					refreshAll={refreshAll}
					txEdit={txEdit}
					setTxEdit={setTxEdit}
				/>

				<select id="select-budget" className="form-select w-auto" value={currentBudget} onChange={(ev) => setCurrentBudget(ev.target.value)}>
					<option value="">All bugdets</option>
					{budgetOptions.map((b, i) => <option key={i} value={b}>{b}</option>)}
				</select>
			</div>

			{ transactions.length > 0 &&
				<table id="transaction-list" className="table table-hover table-sm">
					<thead>
						<tr>
							<th scope="col">Date</th>
							<th scope="col">Description</th>
							<th scope="col">Budget</th>
							<th scope="col">Amount</th>
							<th scope="col"></th>
						</tr>
					</thead>
					<tbody>{els}</tbody>
				</table>
			}

			{transactions.length === 0 && <div className="alert alert-info text-center">You don't have any transactions. Start by clicking "Add Transaction".</div>}
		</div>
	)
}