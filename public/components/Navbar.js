import React from 'react';

import useUser from '../hooks/useUser';

export default function Navbar({
	month, year, setMonth, setYear, activeTab, setActiveTab,
	currentBudget, setCurrentBudget, budgetOptions, transactionMonths,
}) {
	const { user } = useUser();

	const currentYear = new Date().getFullYear();
	const joinedYear = new Date(user.joined).getFullYear();

	const yearEls = [];
	for (let i = currentYear; i >= joinedYear; --i) {
		yearEls.push(<option key={i} value={i}>{i}</option>);
	}

	function changeTabToBudgets() {
		setActiveTab('budgets');
		setCurrentBudget('');
	}

	return (
		<div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
			<ul className="nav nav-underline d-none d-lg-flex" id="myTab" role="tablist">
				<li className="nav-item" role="presentation">
					<button onClick={() => changeTabToBudgets()} className={`nav-link ${activeTab === 'budgets' ? 'active' : ''}`} id="budgets-tab" data-bs-toggle="tab" data-bs-target="#budgets-tab-pane" type="button" role="tab" aria-controls="budgets-tab-pane" aria-selected="true">Budgets</button>
				</li>
				<li className="nav-item" role="presentation">
					<button onClick={() => setActiveTab('transactions')} className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`} id="transactions-tab" data-bs-toggle="tab" data-bs-target="#transactions-tab-pane" type="button" role="tab" aria-controls="transactions-tab-pane" aria-selected="false">Transactions</button>
				</li>
			</ul>

			<div className="d-flex gap-1">

				<select className="form-select form-select-sm flex-shrink-1" value={currentBudget} onChange={ev => setCurrentBudget(ev.target.value)}>
					<option value="">All budgets</option>
					{budgetOptions.map((b, i) => <option key={i} value={b._id}>{b.name}</option>)}
				</select>

				<select id="month-select"
					className="form-select form-select-sm w-auto"
					value={month}
					onChange={e => setMonth(parseInt(e.target.value, 10))}
				>
					{transactionMonths.map((t, i) => <option key={i} value={t.value}>{t.name} ({t.count})</option>)}
				</select>

				<select id="year-select"
					className="form-select form-select-sm w-auto"
					value={year}
					onChange={e => setYear(parseInt(e.target.value, 10))}
				>
					{yearEls}
				</select>
			</div>
		</div>
	);
}
