import React from "react"
import fetchJson from "../fetchJson"
import TransactionModal from "./TransactionModal"
import formatCentsToDollars from "../format"

export default function TransactionList({
	transactions, budgetOptions, refreshAll, currentBudget, setCurrentBudget
}) {
	const [txData, setTxData] = React.useState(null)

	const els = transactions
		.filter(tx => !currentBudget || tx.budget === currentBudget)
		.map((tx, i) => {
			return (
				<tr key={tx._id} className={`bg-transition ${txData && txData._id == tx._id ? 'active-tx' : ''}`} role="button" onClick={() => handleEdit(tx)}>
					<td className="text-nowrap fit">{new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short'})}</td>
					<td style={{maxWidth: '100px'}}  className="text-truncate">beige corolla</td>
					<td style={{maxWidth: '50px'}} className="text-truncate">{tx.budget}</td>
					<td className="text-end fit">{formatCentsToDollars(tx.amount)}</td>
				</tr>
			)
		})


	function handleCreate() {
		setTxData({
			budget: budgetOptions.length > 0 ? budgetOptions[0] : '',
			description: '',
			amount: '',
			date: new Date(),
		})
	}

	function handleEdit(tx) {
		setTxData({
			...tx,
			date: new Date(tx.date),
			amount: (tx.amount / 100).toFixed(2),
		});
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

				<div>
					<select className="form-select" value={currentBudget} onChange={(ev) => setCurrentBudget(ev.target.value)}>
						<option value="">All bugdets</option>
						{budgetOptions.map((b, i) => <option key={i} value={b}>{b}</option>)}
					</select>
				</div>
			</div>

			{ transactions.length > 0 &&
				<div className="table-responsive">
					<table id="transaction-list" className="table table-hover">
						<thead className="text-sm">
							<tr>
								<th scope="col fit">Date</th>
								<th scope="col">Description</th>
								<th scope="col">Budget</th>
								<th scope="col fit" className="text-end">Amount</th>
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