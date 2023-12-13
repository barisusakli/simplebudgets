import React, { useState } from "react"

export default function BottomBar({ activeTab, setActiveTab, onCreateClicked }) {

	return (
		<div className="fixed-bottom d-flex d-lg-none flex-column gap-2">
			<div className="d-flex justify-content-end px-3">
				{
					activeTab === 'budgets' ?
					<button onClick={onCreateClicked} className="btn btn-primary shadow">Create Budget</button>:
					<button onClick={onCreateClicked} className="btn btn-primary shadow">Add Transaction</button>
				}
			</div>
			<div className="bg-white border-top p-3 shadow">
				<div className="container-lg">
					<ul className="nav nav-underline justify-content-around" id={`bottom-bar-tab-${activeTab}`} role="tablist">
						<li className="nav-item" role="presentation">
							<button onClick={() => setActiveTab('budgets')} className={`nav-link ${activeTab === 'budgets' ? 'active' : ''}`} data-bs-toggle="tab" data-bs-target="#budgets-tab-pane" type="button" role="tab" aria-controls="budgets-tab-pane" aria-selected="true">Budgets</button>
						</li>
						<li className="nav-item" role="presentation">
							<button onClick={() => setActiveTab('transactions')} className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}  data-bs-toggle="tab" data-bs-target="#transactions-tab-pane" type="button" role="tab" aria-controls="transactions-tab-pane" aria-selected="false">Transactions</button>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}