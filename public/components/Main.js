import React from "react"

import BudgetList from "./BudgetList"
import TransactionList from "./TransactionList"

export default function Main({ budgets, transactions, budgetOptions, refreshAll }) {
	return (
		<div className="tab-content" id="myTabContent">
			<div className="tab-pane fade show active" id="budgets-tab-pane" role="tabpanel" aria-labelledby="budgets-tab" tabIndex="0">
				<BudgetList
					budgets={budgets}
					refreshAll={refreshAll}
					/>
			</div>
			<div className="tab-pane fade" id="transactions-tab-pane" role="tabpanel" aria-labelledby="transactions-tab" tabIndex="0">
				<TransactionList
					transactions={transactions}
					budgetOptions={budgetOptions}
					refreshAll={refreshAll}
					/>
			</div>
		</div>
	)
}