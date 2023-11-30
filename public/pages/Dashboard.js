import React, { useState, useEffect } from "react"

import Header from "../components/Header"
import Navbar from "../components/Navbar"
import Main from "../components/Main"
import fetchJson from "../fetchJson"

export default function Dashboard(props) {
	const [budgets, setBudgets] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [budgetOptions, setBudgetOptions] = useState([]);

	const date = new Date();
	const [year, setYear] = useState(date.getUTCFullYear())
	const [month, setMonth] = useState(date.getUTCMonth())

	function refreshBudgets() {
		fetchJson({
			url: '/budgets?' + new URLSearchParams({ year, month }),
			method: 'get',
		}).then((result) => {
			setBudgets(result);
			setBudgetOptions(result.map(budget => budget.name));
			console.log('budgets', result)
		})
	}

	function refreshTransactions() {
		fetchJson({
			url: '/transactions?' + new URLSearchParams({ year, month }),
			method: 'get',
		}).then((result) => {
			setTransactions(result)
			console.log('txs', result)
		})
	}

	function refreshAll() {
		refreshBudgets()
		refreshTransactions()
	}

	useEffect(() => {
		refreshAll();
	}, [year, month])

	return (
		<section className="section d-flex flex-column gap-3 pb-5">
			<Header user={props.user} setUser={props.setUser} />
			<div className="card shadow-sm">
				<div className="card-body">
					<Navbar year={year} setYear={setYear} month={month} setMonth={setMonth} />
					<Main
						budgets={budgets}
						setBudgets={setBudgets}
						transactions={transactions}
						setTransactions={setTransactions}
						budgetOptions={budgetOptions}
						refreshAll={refreshAll}
					/>
				</div>
			</div>
		</section>
	)
}
