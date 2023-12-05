import React, { useState } from "react"
import { Link } from "react-router-dom";
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"

export default function LoginForm({ setUser }) {
	const [formData, setFormData] = React.useState({
		email: '',
		password: '',
	});

	const [loginError, setLoginError] = useState('');

	async function handleSubmit(event) {
		event.preventDefault();
		if (!formData.email || !formData.password) {
			return;
		}
		try {
			const loggedInUser = await fetchJson({
				url: '/login',
				data: formData,
				method: 'post',
			})
			setUser(loggedInUser)
		} catch (err) {
			setLoginError(err.message)
		}
	}

	return (
		<div className="row justify-content-center">
			<div className="col-12 col-md-6">
				<div className="card shadow-sm">
					<div className="card-body">
						<form onSubmit={handleSubmit}>
							<div className="mb-3">
								<label htmlFor="email" className="form-label">Email</label>
								<input
									className="form-control"
									type="email"
									placeholder="your@email.com"
									onChange={ev => formHandleChange(ev, setFormData)}
									name="email"
									value={formData.email}
									required
								/>
							</div>
							<div className="mb-3">
								<div className="d-flex justify-content-between align-items-center">
									<label htmlFor="password" className="form-label">Password</label>
									<Link to="/reset" className="text-sm mb-2">Forgot password?</Link>
								</div>
								<input
									className="form-control"
									type="password"
									onChange={ev => formHandleChange(ev, setFormData)}
									name="password"
									value={formData.pasword}
									required
								/>
							</div>
							<button type="submit" className="btn btn-primary fw-secondary w-100 text-center">Login</button>
							{loginError && <p className="form-text text-danger">{loginError}</p>}
							<hr />
							<p className="form-text mb-0">Don't have an account? <Link to="/register">Register</Link></p>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}