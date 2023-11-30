import React, { useState, useEffect } from "react"

import fetchJson from "../fetchJson"

import CreateTransaction from "./CreateTransaction"

export default function TransactionList({ transactions, budgetOptions, refreshAll }) {

	var formatCentsToDollars = function(value) {
		// value = (value + '').replace(/[^\d.-]/g, '');
		// value = parseFloat(value);
		// return value ? value / 100 : 0;
		return (value / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
	}

	const els = transactions.map((tx, i) => {
		return (
			<tr key={i}>
				<td>{tx.date.split('T')[0]}</td>
				<td>{tx.description}</td>
				<td>{tx.budget}</td>
				<td>{formatCentsToDollars(tx.amount)}</td>
				<td className="text-end"><button onClick={() => handleDelete(tx._id)} className="btn btn-sm btn-danger lh-1">X</button></td>
			</tr>
		)
	})

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
			<CreateTransaction
				budgetOptions={budgetOptions}
				refreshAll={refreshAll}
				/>

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

		</div>
	)
}