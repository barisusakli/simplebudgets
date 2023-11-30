
import React from "react"
import { Navigate } from "react-router-dom"
import RegisterForm from "../components/RegisterForm"

export default function Register({ user, setUser }) {
	if (user) {
		return <Navigate to="/dashboard" />
	}
	return (
		<div className="pt-4 d-flex flex-column gap-4">
			<h1 className="fw-semibold text-center m-0">Register</h1>
			<RegisterForm setUser={setUser} />
		</div>
	)
}