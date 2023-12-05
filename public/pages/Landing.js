import React, { useEffect } from "react"
import { Navigate } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import fetchJson from "../fetchJson"

export default function Landing({ user, setUser }) {
	if (user) {
		return <Navigate to="/dashboard" />
	}

	return (
		<div className="pt-4 d-flex flex-column gap-4">
			<div>
				<h1 className="fs-2 text-secondary fw-semibold text-center m-0">Welcome to</h1>
				<h1 className="fw-semibold text-center m-0">Simple Budgets!</h1>
			</div>
			<LoginForm setUser={setUser}/>
		</div>
	)
}