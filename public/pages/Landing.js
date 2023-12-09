import React from "react"
import { Link } from "react-router-dom"

export default function Landing() {
	return (
		<div>
			<div className="pt-4 d-flex flex-column gap-4">
				<div>
					<h1 className="fs-2 text-secondary fw-semibold text-center m-0">Welcome to</h1>
					<h1 className="fw-semibold text-center m-0">Simple Budgets!</h1>
				</div>
				<div className="d-flex flex-column justify-content-lg-center flex-lg-row gap-5">

						<div className="text-center">
							<img className="shadow-sm border-0 rounded-3 p-2 bg-white" src="/assets/screenshots/dashboard.png" height={400} style={{width: 'auto'}}/>
						</div>

						<ul className="fs-5 text-secondary d-flex flex-column gap-4 my-auto mx-auto mx-lg-0">
							<li>Quickly create budgets.</li>
							<li>Add your transactions.</li>
							<li>Easily track your monthly spending.</li>
							<li>See your spending history in one place.</li>
							<li>100% <span className="text-underline">free</span> and mobile-friendly!</li>
							<li>Ready to start? <Link to="/register">Register</Link> or <Link to="/login">Login</Link>.</li>
						</ul>

				</div>
			</div>
		</div>
	)
}