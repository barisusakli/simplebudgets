import React, { useState, useEffect } from "react"

import Header from "../components/Header"
import Navbar from "../components/Navbar"
import Main from "../components/Main"
import fetchJson from "../fetchJson"

export default function Dashboard(props) {
	const [isLoaded, setIsLoaded] = useState(false);
	const [budgets, setBudgets] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [budgetOptions, setBudgetOptions] = useState([]);

	const date = new Date();
	const [year, setYear] = useState(date.getFullYear())
	const [month, setMonth] = useState(date.getMonth())

	function getStartEnd() {
		const startDate = new Date();
		startDate.setFullYear(year, month, 1);
		startDate.setHours(0, 0, 0, 0);

		const endDate = new Date();
		endDate.setFullYear(year, startDate.getMonth() + 1, 1);
		endDate.setHours(0, 0, 0, 0);

		return {
			monthStart: startDate.getTime(),
			monthEnd: endDate.getTime(),
		};
	}

	async function loadBudgets() {
		return await fetchJson({
			url: '/api/budgets?' + new URLSearchParams(getStartEnd()),
			method: 'get',
		})
	}

	async function loadTransactions() {
		return await fetchJson({
			url: '/api/transactions?' + new URLSearchParams(getStartEnd()),
			method: 'get',
		});
	}

	async function refreshAll() {
		const [budgetData, txData] = await Promise.all([
			loadBudgets(),
			loadTransactions(),
		]);

		setBudgets(budgetData)
		setBudgetOptions(budgetData.filter(budget => !!budget._id).map(budget => budget.name))
		setTransactions(txData)
		setIsLoaded(true)
	}

	useEffect(() => {
		refreshAll()
	}, [year, month])

	return (
		<section className="section d-flex flex-column gap-3 pb-5">
			<Header user={props.user} setUser={props.setUser} />
			<div className="card shadow-sm">
				<div className="card-body">
					<Navbar year={year} setYear={setYear} month={month} setMonth={setMonth} />
					{isLoaded && <Main
						budgets={budgets}
						transactions={transactions}
						budgetOptions={budgetOptions}
						refreshAll={refreshAll}
						isCurrentMonth={month === date.getMonth() && year === date.getFullYear()}
					/>}
				</div>
			</div>
		</section>
	)
}
