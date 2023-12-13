import React from "react"
import fetchJson from "../fetchJson"
import BudgetModal from "./BudgetModal"
import ConfirmModal from "./ConfirmModal"
import BottomBar from "./BottomBar"
import formatCentsToDollars from "../format"
import useAlert from "../hooks/useAlert"

export default function BudgetList({
	budgets, refreshAll, currentBudget, setCurrentBudget, activeTab, setActiveTab, isCurrentMonth,
}) {
	const { setAlert } = useAlert()
	const [budgetData, setBudgetData] = React.useState(null)
	const [deleteBugdet, setDeleteBugdet] = React.useState(null)

	const now = new Date()
	const numberOfDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()

	function calculateMonthProgressPercent() {
		return Math.min(99.5, parseFloat((new Date().getDate() / numberOfDaysInMonth) * 100));
	}

	function handleFilterBudget(ev, name) {
		ev.preventDefault()
		setCurrentBudget(name)
		setActiveTab('transactions')
	}

	const els = budgets
		.filter(budget => !currentBudget || budget.name === currentBudget)
		.map((budget) => {
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
							{isCurrentMonth && <div className="position-absolute border border-black" style={{
								left: `${calculateMonthProgressPercent()}%`,
								width: '1px',
								height: '100%'
							}}></div>}
						</div>
					</div>
					<div className="d-flex justify-content-between align-items-center">
						<div className="text-sm text-secondary">
							{formatCentsToDollars(budget.current)} of {formatCentsToDollars(budget.amount)}
						</div>
						<div className="d-flex gap-2">
							{budget._id && <a className="btn btn-sm btn-link text-danger" onClick={() => setDeleteBugdet(budget)}>Delete</a>}
							{budget._id && <a className="btn btn-sm btn-link" onClick={() => handleEdit(budget)}>Edit</a>}
						</div>
					</div>
					{budget._id ? <hr className="d-block d-lg-none" /> : <hr/>}
				</li>
			)
		})

	function handleCreate() {
		setBudgetData({
			name: '',
			amount: '',
		})
	}

	function handleEdit(budget) {
		setBudgetData({
			...budget,
			amount: (budget.amount / 100).toFixed(2),
		});
	}

	function handleDelete(confirm, _id) {
		if (!confirm) {
			setDeleteBugdet(null)
			return
		}
		fetchJson({
			url: '/api/budgets/delete',
			data: { _id },
			method: 'post',
		}).then(() => {
			refreshAll()
			setDeleteBugdet(null)
		}).catch(err => setAlert(err.message, 'danger'))
	}

	return (
		<div className="mt-3 d-flex flex-column gap-3">
			<button className="btn btn-primary ff-secondary text-nowrap align-self-start d-none d-lg-block" onClick={handleCreate}>Create Budget</button>

			{!!budgetData && <BudgetModal
				refreshAll={refreshAll}
				budgetData={budgetData}
				onHidden={() => setBudgetData(null)}
			/>}

			{deleteBugdet && <ConfirmModal
				id="delete-budget-confirm"
				title="Confirm Budget Delete"
				onSubmit={confirm => handleDelete(confirm, deleteBugdet._id)}
				>
					<div className="alert alert-danger">Do you really want to delete the <strong>"{deleteBugdet.name}"</strong> budget?</div>
				</ConfirmModal>
			}

			<ul id="budgets-list" className="list-unstyled d-flex flex-column gap-3">
				{els}
				{budgets.length <= 1 &&	<div className="alert alert-info text-center">You don't have any budgets. Start by clicking "Create Budget".</div>}
			</ul>

			<BottomBar
				createButton={<button onClick={handleCreate} className="btn btn-primary shadow">Create Budget</button>}
				activeTab={activeTab}
				setActiveTab={setActiveTab}
			/>
		</div>
	)
}