import React from "react"
import { Navigate } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import useUser from "../hooks/useUser";

export default function Landing({ isLoading }) {
	const { user } = useUser();
	if (user) {
		return <Navigate to="/dashboard" />
	}

	return (
		<div>
			{
			!isLoading &&
			<div className="py-4 d-flex flex-column gap-4">
				<div>
					<h1 className="fs-2 text-secondary fw-semibold text-center m-0">Welcome to</h1>
					<h1 className="fw-semibold text-center m-0">Simple Budgets!</h1>
				</div>
				<div className="d-flex flex-column justify-content-lg-center flex-lg-row flex-column-reverse gap-5">
					<ul className="fs-5 text-secondary d-flex flex-column gap-4 my-auto mx-auto mx-lg-0">
						<li>Quickly create budgets & add transactions</li>
						<li>Track your monthly spending in one place.</li>
						<li>Filter your spending by different budget categories.</li>
						<li>100% <span className="text-decoration-underline">free</span> and mobile-friendly!</li>
					</ul>
					<LoginForm/>
				</div>
				<hr/>
				<h3 className="fw-semibold text-center m-0">Screenshots</h3>
				<img src="/assets/screenshots/budgets.png" alt="budget-screen"/>
				<img src="/assets/screenshots/transactions.png" alt="transaction-screen"/>
			</div>
			}
		</div>

	)
}