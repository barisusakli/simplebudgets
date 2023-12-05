import React, { useEffect } from "react"
import { Navigate } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import fetchJson from "../fetchJson"

export default function Landing({ user, setUser }) {
	if (user) {
		return <Navigate to="/dashboard" />
	}
	const [loading, setLoading] = React.useState(true);
	useEffect(() => {
		fetchJson({
			url: '/user',
			method: 'get',
		}).then((result) => {
			if (result) {
				console.log(result);
				setUser({ email: result.email })
			}
		}).catch(err => {
			console.log(err);
		}).finally(() => {
			setLoading(false);
		})
	}, [])

	return (
		<div className={`pt-4 d-flex flex-column gap-4 ${loading ? 'd-none' : ''}`}>
			<div>
				<h1 className="fs-2 text-secondary fw-semibold text-center m-0">Welcome to</h1>
				<h1 className="fw-semibold text-center m-0">Simple Budgets!</h1>
			</div>
			<LoginForm setUser={setUser}/>
		</div>
	)
}