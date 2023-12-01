import React from "react"
import fetchJson from "../fetchJson"
import CreateBudget from "./CreateBudget"
import formatCentsToDollars from "../format"
import * as bootstrap from 'bootstrap'

export default function BudgetList({ budgets, refreshAll, setCurrentBudget }) {
	const now = new Date();
	const numberOfDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

	function calculateMonthProgressPercent() {
		return Math.min(99.5, parseFloat((new Date().getDate() / numberOfDaysInMonth) * 100));
	}

	function handleFilterBudget(ev, name) {
		ev.preventDefault();
		setCurrentBudget(name);
		const triggerEl = document.querySelector('#myTab button[data-bs-target="#transactions-tab-pane"]')
		if (triggerEl) {
			bootstrap.Tab.getOrCreateInstance(triggerEl).show()
		}
	}

	const els = budgets.map((budget) => {
		return (
			<li key={budget._id || budget.name} className="d-flex flex-column gap-2">
				<div className="d-flex justify-content-between"><a href="#" className="fw-bold text-reset link-underline-dark link-underline-opacity-0 link-underline-opacity-100-hover" onClick={(ev)=> handleFilterBudget(ev, budget._id ? budget.name : '')}>{budget.name}</a><span className="text-sm">{
					budget.leftOrOver >= 0 ?
					`${formatCentsToDollars(budget.leftOrOver)} left` :
					`${formatCentsToDollars(Math.abs(budget.leftOrOver))} over`
				}</span></div>
				<div>
					<div className="progress position-relative" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
						<div className={`progress-bar ${budget.bgColor}`} style={{width: Math.min(100, budget.percent) + '%'}}></div>
						<div className="position-absolute border border-black" style={{
							left: `${calculateMonthProgressPercent()}%`,
							width: '1px',
							height: '100%'
						}}></div>
					</div>
				</div>
				<div className="d-flex justify-content-between align-items-center">
					<div className="text-sm text-secondary">
						{formatCentsToDollars(budget.current)} of {formatCentsToDollars(budget.amount)}
					</div>
					{budget._id && <a className="btn btn-sm btn-link text-danger" onClick={() => handleDelete(budget._id)}>Delete</a>}
				</div>
				{!budget._id && <hr/>}
			</li>
		)
	})

	function handleDelete(_id) {
		fetchJson({
			url: '/budgets/delete',
			data: { _id },
			method: 'post',
		}).then(() => {
			refreshAll()
		})
	}

	return (
		<div className="mt-3 d-flex flex-column gap-3">
			<CreateBudget
				refreshAll={refreshAll}
			/>
			<ul id="budgets-list" className="list-unstyled d-flex flex-column gap-3">
				{els}
				{budgets.length <= 1 &&	<div className="alert alert-info text-center">You don't have any budgets. Start by clicking "Create Budget".</div>}
			</ul>
		</div>
	)
}