
import React from "react"
import { Navigate } from "react-router-dom"
import RegisterForm from "../components/RegisterForm"
import UserContext from "../contexts/UserContext";

export default function Register() {
	const { user } = useContext(UserContext);
	if (user) {
		return <Navigate to="/dashboard" />
	}
	return (
		<div className="pt-4 d-flex flex-column gap-4">
			<h1 className="fw-semibold text-center m-0">Register</h1>
			<RegisterForm />
		</div>
	)
}