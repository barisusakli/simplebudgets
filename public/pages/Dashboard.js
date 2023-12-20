import React, { useState, useEffect, useCallback } from 'react';

import Header from '../components/Header';
import Main from '../components/Main';
import fetchJson from '../fetchJson';
import useAlert from '../hooks/useAlert';

export default function Dashboard() {
	const [isLoaded, setIsLoaded] = useState(false);
	const [budgets, setBudgets] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [budgetOptions, setBudgetOptions] = useState([]);
	const { setAlert } = useAlert();

	const date = new Date();
	const [year, setYear] = useState(date.getFullYear());
	const [month, setMonth] = useState(date.getMonth());

	const refreshAll = useCallback(() => {
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

		function loadBudgets() {
			return fetchJson({
				url: `/api/budgets?${new URLSearchParams(getStartEnd())}`,
				method: 'get',
			});
		}

		function loadTransactions() {
			return fetchJson({
				url: `/api/transactions?${new URLSearchParams(getStartEnd())}`,
				method: 'get',
			});
		}

		Promise.all([
			loadBudgets(),
			loadTransactions(),
		]).then(([budgetData, txData]) => {
			setBudgets(budgetData);
			setBudgetOptions(budgetData.filter(budget => !!budget._id).map(budget => budget.name));
			setTransactions(txData);
			setIsLoaded(true);
		}).catch(err => setAlert(err.message, 'danger'));
	}, [month, year, setAlert]);

	useEffect(() => {
		refreshAll();
	}, [year, month, refreshAll]);

	return (
		<section className="section d-flex flex-column gap-3 pb-5 mb-5 mb-lg-0">
			<Header />
			<div className="card shadow-sm">
				<div className="card-body">
					{isLoaded && <Main
						budgets={budgets}
						transactions={transactions}
						budgetOptions={budgetOptions}
						refreshAll={refreshAll}
						month={month}
						year={year}
						setYear={setYear}
						setMonth={setMonth}
					/>}
				</div>
			</div>
			<p className="text-sm text-secondary text-center pb-5 pb-lg-0">Bug Reports & Contact: <a href="mailto:support@simplebudgets.ca">support@simplebudgets.ca</a></p>
		</section>
	);
}
