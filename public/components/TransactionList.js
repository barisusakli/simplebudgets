import React from 'react';

import TransactionModal from './TransactionModal';
import formatCentsToDollars from '../format';


export default function TransactionList({ transactions, budgetOptions, refreshAll, currentBudget, handleCreate }) {
	const [txData, setTxData] = React.useState(null);

	const els = transactions
		.filter(tx => !currentBudget || tx.budget === currentBudget)
		.map(tx => (
			<tr key={tx._id} className={`bg-transition ${txData && txData._id === tx._id ? 'active-tx' : ''}`} role="button" onClick={() => handleEdit(tx)}>
				<td className="text-nowrap fit">{new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}</td>
				<td style={{ maxWidth: '100px' }} className="text-truncate">{tx.description}</td>
				<td style={{ maxWidth: '50px' }} className="text-truncate">{tx.budget}</td>
				<td className={`text-end fit ${tx.type === 'income' ? 'text-success' : ''}`}>
					{tx.type === 'expense' && '-'}{formatCentsToDollars(tx.amount)}
				</td>
			</tr>
		));

	function handleEdit(tx) {
		setTxData({
			...tx,
			date: new Date(tx.date),
			amount: (tx.amount / 100).toFixed(2),
		});
	}

	return (
		<div className="mt-3 d-flex flex-column gap-3">
			<button className="btn btn-primary ff-secondary text-nowrap align-self-start d-none d-lg-block" onClick={() => handleCreate(setTxData)}>Add Transaction</button>

			{txData && <TransactionModal
				budgetOptions={budgetOptions}
				refreshAll={refreshAll}
				txData={txData}
				onHidden={() => setTxData(null)}
			/>}

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
	);
}
