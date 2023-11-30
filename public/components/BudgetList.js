import React from "react"

export default function BudgetList({ budgets }) {
	const els = budgets.map((budget) => {
		return (
			<li key={budget._id || budget.name} className="d-flex flex-column gap-2">
				<div className="d-flex justify-content-between"><strong>{budget.name}</strong><span className="text-sm">{budget.leftOrOver}</span></div>
				<div>
					<div className="progress position-relative" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
						<div className={`progress-bar ${budget.bgColor}`} style={{width: Math.min(100, budget.percent) + '%'}}></div>
						<div className="position-absolute border border-black" style={{
							left: `${Math.min(99.5, budget.percentMonth)}%`,
							width: '1px',
							height: '100%'
						}}></div>
					</div>
				</div>
				<div className="text-sm text-secondary">
					${budget.current} of ${budget.amount}
				</div>
				{budget.name === 'Total' && <hr/>}
			</li>
		)
	})

	function handleCreate() {
		console.log('TODO create new budget');
	}

	return (
		<div className="mt-3 d-flex flex-column gap-3">
			<button id="create-budget" className="btn btn-primary" onClick={handleCreate}>Create Budget</button>
			<ul id="budgets-list" className="list-unstyled d-flex flex-column gap-3">
				{els}
			</ul>
		</div>
	)
}