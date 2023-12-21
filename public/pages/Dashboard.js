import React, { useState, useEffect, useCallback, useRef } from 'react';

import Header from '../components/Header';
import fetchJson from '../fetchJson';
import useAlert from '../hooks/useAlert';
import BottomBar from '../components/BottomBar';
import BudgetList from '../components/BudgetList';
import TransactionList from '../components/TransactionList';
import Navbar from '../components/Navbar';

export default function Dashboard() {
	const [currentBudget, setCurrentBudget] = React.useState('');
	const [activeTab, setActiveTab] = React.useState('budgets');

	const budgetListRef = useRef(null);
	const txListRef = useRef(null);

	const [isLoaded, setIsLoaded] = useState(false);
	const [budgets, setBudgets] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [budgetOptions, setBudgetOptions] = useState([]);
	const { setAlert } = useAlert();

	const date = new Date();
	const [year, setYear] = useState(date.getFullYear());
	const [month, setMonth] = useState(date.getMonth());
	const isCurrentMonth = month === date.getMonth() && year === date.getFullYear();

	function handleBottombarCreate() {
		if (activeTab === 'budgets') {
			budgetListRef?.current?.openCreate();
		} else if (activeTab === 'transactions') {
			txListRef?.current?.openCreate();
		}
	}

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
					{ isLoaded &&
					<div>
						<Navbar
							year={year}
							setYear={setYear}
							month={month}
							setMonth={setMonth}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							currentBudget={currentBudget}
							setCurrentBudget={setCurrentBudget}
							budgetOptions={budgetOptions}
						/>

						<div className="tab-content" id="myTabContent">
							<div className={`tab-pane fade ${activeTab === 'budgets' ? 'show active' : ''}`} id="budgets-tab-pane" role="tabpanel" aria-labelledby="budgets-tab" tabIndex="0">
								<BudgetList
									ref={budgetListRef}
									budgets={budgets}
									refreshAll={refreshAll}
									currentBudget={currentBudget}
									setCurrentBudget={setCurrentBudget}
									isCurrentMonth={isCurrentMonth}
									setActiveTab={setActiveTab}
								/>
							</div>

							<div className={`tab-pane fade ${activeTab === 'transactions' ? 'show active' : ''}`}id="transactions-tab-pane" role="tabpanel" aria-labelledby="transactions-tab" tabIndex="0">
								<TransactionList
									ref={txListRef}
									transactions={transactions}
									budgetOptions={budgetOptions}
									refreshAll={refreshAll}
									currentBudget={currentBudget}
								/>
							</div>
						</div>

						<BottomBar
							onCreateClicked={handleBottombarCreate}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
						/>

					</div>
					}
				</div>
			</div>
			<p className="text-sm text-secondary text-center pb-5 pb-lg-0">Bug Reports & Contact: <a href="mailto:support@simplebudgets.ca">support@simplebudgets.ca</a></p>
		</section>
	);
}
