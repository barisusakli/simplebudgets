import React from "react"

import BudgetList from "./BudgetList"
import TransactionList from "./TransactionList"
import Navbar from "./Navbar"

export default function Main({ budgets, transactions, budgetOptions, refreshAll, setYear, setMonth, year, month }) {
	const [currentBudget, setCurrentBudget] = React.useState('')
	const [activeTab, setActiveTab] = React.useState('budgets')

	const date = new Date();
	const isCurrentMonth = month === date.getMonth() && year === date.getFullYear()

	return (
		<>
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
						budgets={budgets}
						refreshAll={refreshAll}
						currentBudget={currentBudget}
						setCurrentBudget={setCurrentBudget}
						isCurrentMonth={isCurrentMonth}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						/>

				</div>
				<div className={`tab-pane fade ${activeTab === 'transactions' ? 'show active' : ''}`}  id="transactions-tab-pane" role="tabpanel" aria-labelledby="transactions-tab" tabIndex="0">
					<TransactionList
						transactions={transactions}
						budgetOptions={budgetOptions}
						refreshAll={refreshAll}
						setCurrentBudget={setCurrentBudget}
						currentBudget={currentBudget}
						activeTab={activeTab}
						setActiveTab={setActiveTab}
						/>
				</div>
			</div>
		</>
	)
}