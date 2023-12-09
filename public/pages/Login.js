
import React from "react"
import { Navigate } from "react-router-dom"
import LoginForm from "../components/LoginForm"
import useUser from "../hooks/useUser";

export default function Login() {
	const { user } = useUser();
	if (user) {
		return <Navigate to="/dashboard" />
	}
	return (
		<div className="pt-4 d-flex flex-column gap-4">
			<h1 className="fw-semibold text-center m-0">Login</h1>
			<LoginForm />
		</div>
	)
}