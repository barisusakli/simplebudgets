import React from 'react';
import { Navigate } from 'react-router';
import LoginForm from '../components/LoginForm';
import useUser from '../hooks/useUser';

export default function Landing({ isLoading }) {
	const { user } = useUser();
	if (user) {
		return <Navigate to="/dashboard" />;
	}

	return (
		<div>
			{
				!isLoading &&
				<div className="py-4 d-flex flex-column gap-4">
					<div>
						<h1 className="text-center fw-semibold m-0">
							<span className="text-secondary fs-2">Welcome to</span><br/>
							<span className="">Simple Budgets!</span>
						</h1>
					</div>
					<div className="d-flex flex-column justify-content-lg-center align-items-center flex-lg-row flex-column-reverse gap-5">
						<div className="px-0 px-xl-4 my-auto">
							<ul className="fs-5 text-secondary d-flex flex-column gap-4 mx-auto mx-lg-0">
								<li>Quickly create budgets & add transactions</li>
								<li>Track your monthly spending in one place.</li>
								<li>Filter your spending by different budget categories.</li>
								<li>100% <span className="text-decoration-underline">free</span> and mobile-friendly!</li>
							</ul>
						</div>
						<LoginForm/>
					</div>
					<hr/>
					<h3 className="fw-semibold text-center m-0">Screenshots</h3>
					<img src="/assets/screenshots/budgets.png" alt="budget-screen"/>
					<img src="/assets/screenshots/transactions.png" alt="transaction-screen"/>
				</div>
			}
		</div>

	);
}
