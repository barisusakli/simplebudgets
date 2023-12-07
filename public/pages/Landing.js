import React, { useContext } from "react"
import { Navigate } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import UserContext from "../contexts/UserContext"

export default function Landing({ isLoading }) {
	const { user } = useContext(UserContext);
	if (user) {
		return <Navigate to="/dashboard" />
	}

	return (
		<div>
			{ !isLoading && <div className="pt-4 d-flex flex-column gap-4">
				<div>
					<h1 className="fs-2 text-secondary fw-semibold text-center m-0">Welcome to</h1>
					<h1 className="fw-semibold text-center m-0">Simple Budgets!</h1>
				</div>
				<LoginForm/>
			</div>}
		</div>
	)
}