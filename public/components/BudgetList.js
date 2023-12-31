import React from 'react';
import fetchJson from '../fetchJson';
import BudgetModal from './BudgetModal';
import ConfirmModal from './ConfirmModal';
import formatCentsToDollars from '../format';
import useAlert from '../hooks/useAlert';

export default function BudgetList({
	budgetData, refreshAll, currentBudget, setCurrentBudget, setActiveTab, isCurrentMonth, handleCreate,
}) {
	const { setAlert } = useAlert();
	const [currentBudgetData, setCurrentBudgetData] = React.useState(null);
	const [deleteBudget, setDeleteBudget] = React.useState(null);

	const now = new Date();
	const numberOfDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

	function calculateMonthProgressPercent() {
		return Math.min(99.5, parseFloat((new Date().getDate() / numberOfDaysInMonth) * 100));
	}

	function handleFilterBudget(ev, name) {
		ev.preventDefault();
		setCurrentBudget(name);
		setActiveTab('transactions');
	}

	function budgetToJsx(budget) {
		return (
			<div key={budget._id || budget.name} className="d-flex flex-column gap-2">
				<div className="d-flex justify-content-between"><a href="#" className="fw-bold text-reset link-underline-dark link-underline-opacity-0 link-underline-opacity-100-hover" onClick={ev => handleFilterBudget(ev, budget._id ? budget.name : '')}>{budget.name}</a><span className="text-sm">{
					budget.leftOrOver >= 0 ?
						`${formatCentsToDollars(budget.leftOrOver)} left` :
						`${formatCentsToDollars(Math.abs(budget.leftOrOver))} over`
				}</span></div>
				<div>
					<div className="progress position-relative" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
						<div className={`progress-bar ${budget.bgColor}`} style={{ width: `${Math.min(100, budget.percent)}%` }}></div>
						{isCurrentMonth && <div className="position-absolute border border-black" style={{
							left: `${calculateMonthProgressPercent()}%`,
							width: '1px',
							height: '100%',
						}}></div>}
					</div>
				</div>
				<div className="d-flex justify-content-between align-items-center">
					<div className="text-sm text-secondary">
						{formatCentsToDollars(budget.current)} of {formatCentsToDollars(budget.amountAvailable)}
					</div>
					<div className="d-flex gap-2">
						{budget._id && <a className="btn btn-sm btn-link text-danger" onClick={() => setDeleteBudget(budget)}>Delete</a>}
						{budget._id && <a className="btn btn-sm btn-link" onClick={() => handleEdit(budget)}>Edit</a>}
					</div>
				</div>
				{budget._id ? <hr className="d-block d-lg-none" /> : <hr/>}
			</div>
		);
	}

	const allBudgets = budgetData.budgets
		.filter(budget => !currentBudget || budget.name === currentBudget);

	const incomeBudgets = allBudgets.filter(b => b.type === 'income');
	const expenseBudgets = allBudgets.filter(b => b.type === 'expense');

	function handleEdit(budget) {
		setCurrentBudgetData({
			...budget,
			amount: (budget.amount / 100).toFixed(2),
		});
	}

	function handleDelete(confirm, _id) {
		if (!confirm) {
			setDeleteBudget(null);
			return;
		}
		fetchJson({
			url: '/api/budgets/delete',
			data: { _id },
			method: 'post',
		}).then(() => {
			refreshAll();
			setDeleteBudget(null);
		}).catch(err => setAlert(err.message, 'danger'));
	}

	return (
		<div className="mt-3 d-flex flex-column gap-3">
			<button className="btn btn-primary ff-secondary text-nowrap align-self-start d-none d-lg-block" onClick={() => handleCreate(setCurrentBudgetData)}>Create Budget</button>

			{!!currentBudgetData && <BudgetModal
				refreshAll={refreshAll}
				budgetData={currentBudgetData}
				onHidden={() => setCurrentBudgetData(null)}
			/>}

			{deleteBudget &&
				<ConfirmModal
					title="Confirm Budget Delete"
					onSubmit={confirm => handleDelete(confirm, deleteBudget._id)}
				>
					<div className="alert alert-danger">Do you really want to delete the <strong>"{deleteBudget.name}"</strong> budget?</div>
				</ConfirmModal>
			}

			<div className="d-flex flex-column gap-5">
				{incomeBudgets.length > 0 &&
					<div>
						<div className="border-bottom pb-1 mb-3 d-flex gap-2 justify-content-between align-items-center">
							<h5 className="fw-semibold mb-0">Income</h5>
							<div className="fs-6">
								<span className="fw-semibold">{formatCentsToDollars(budgetData.currentIncome)}</span> of {formatCentsToDollars(budgetData.totalIncome)}
							</div>
						</div>
						<div className="d-flex flex-column gap-3 ms-0 ms-lg-1">
							{incomeBudgets.map(budgetToJsx)}
						</div>
					</div>
				}
				<div>
					<div className="border-bottom pb-1 mb-3 d-flex gap-2 justify-content-between align-items-center">
						<h5 className="fw-semibold mb-0">Spending</h5>
						<div className="fs-6">
							<span className="fw-semibold">{formatCentsToDollars(budgetData.currentSpending)}</span> of {formatCentsToDollars(budgetData.totalSpending)}
						</div>
					</div>
					<div className="d-flex flex-column gap-3 ms-0 ms-lg-1">
						{expenseBudgets.map(budgetToJsx)}
					</div>
				</div>
				{budgetData.budgets.length <= 1 && <div className="alert alert-info text-center">You don't have any budgets. Start by clicking "Create Budget".</div>}
			</div>
		</div>
	);
}
