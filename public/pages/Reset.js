import React, { useState } from "react"
import { Link, useParams, Navigate } from "react-router-dom"
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"

export default function Reset({ user }) {
	if (user) {
		return <Navigate to="/dashboard" />
	}
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		passwordConfirm: ''
	});

	const { code } = useParams();
	const [error, setError] = useState('')
	const [success, setSuccess] = useState(false);

	const noMatch = formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm;

	async function handleResetSend(event) {
		event.preventDefault();
		if (!formData.email) {
			return;
		}
		try {
			setError('')
			await fetchJson({
				url: '/password/reset/send',
				data: formData,
				method: 'post',
			})
			setSuccess(true)
		} catch (err) {
			setError(err.message)
		}
	}

	async function handleResetCommit(event) {
		event.preventDefault();
		if (noMatch || !formData.password) {
			return;
		}
		try {
			setError('')
			await fetchJson({
				url: '/password/reset/commit',
				data: {
					code: code,
					password: formData.password
				},
				method: 'post',
			})
			setSuccess(true)
		} catch (err) {
			setError(err.message)
		}
	}

	const sendForm = (
		<form onSubmit={handleResetSend}>
			<div className="mb-3">
				<label htmlFor="email" className="form-label">Email</label>
				<input
					id="email"
					className="form-control"
					type="email"
					placeholder="your@email.com"
					onChange={ev => formHandleChange(ev, setFormData)}
					name="email"
					value={formData.email}
					required
					autoComplete="off"
				/>
				<p className="form-text">
					Enter the email address you registered with and we will send an email with instructions on how to reset your password.
				</p>
			</div>

			<button type="submit" className="btn btn-primary fw-secondary w-100 text-center">Send Password Reset Email</button>
			{error && <p className="form-text text-danger">{error}</p>}
			<hr />
			{success && <div className="alert alert-success">Password reset email sent!</div>}
		</form>
	)


	const changeForm = (
		<form onSubmit={handleResetCommit}>
			<div className="mb-3">
				<label htmlFor="password" className="form-label">Password</label>
				<input
					id="password"
					className="form-control"
					type="password"
					onChange={ev => formHandleChange(ev, setFormData)}
					name="password"
					value={formData.pasword}
					minLength="8"
					maxLength="64"
					required
					autoComplete="off"
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
				<input
					id="passwordConfirm"
					className="form-control"
					type="password"
					onChange={ev => formHandleChange(ev, setFormData)}
					name="passwordConfirm"
					value={formData.passwordConfirm}
					minLength="8"
					maxLength="64"
					required
					autoComplete="off"
				/>
				{noMatch && <p className="form-text text-danger">Passwords do no match</p>}
			</div>
			<button type="submit" className="btn btn-primary fw-secondary w-100 text-center">Change Password</button>
			{error && <p className="form-text text-danger">{error}</p>}
			<hr />
			{success && <div className="alert alert-success">Password changed! <Link to="/" className="alert-link">Login</Link></div>}
		</form>
	)

	return (
		<div className="pt-4 d-flex flex-column gap-4">
			<h1 className="fw-semibold text-center m-0">Reset Password</h1>
			<div className="row justify-content-center">
				<div className="col-12 col-md-6">
					<div className="card shadow-sm">
						<div className="card-body">
						{code ? changeForm : sendForm}
						</div>
					</div>
				</div>
			</div>
		</div>

	)
}