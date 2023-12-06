import React, { useState } from "react"
import { Link } from "react-router-dom";
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"

export default function RegisterForm({ setUser }) {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
		passwordConfirm: '',
	})

	const [userNameTaken, setUsernameTaken] = useState('')
	const [registerError, setRegisterError] = useState('');

	const noMatch = formData.password && formData.passwordConfirm && formData.password !== formData.passwordConfirm;

	async function handleSubmit(event) {
		event.preventDefault();
		if (noMatch) {
			return;
		}

		try {
			const user = await fetchJson({
				url: '/api/register',
				data: formData,
				method: 'post',
			})
			setUser(user)
		} catch (err) {
			if (err.message === 'User already exists') {
				setUsernameTaken(err.message)
			} else {
				setRegisterError(err.message)
			}
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
								{userNameTaken && <p className="form-text text-danger">{userNameTaken}</p>}
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">Password</label>
								<input
									id="password"
									className="form-control"
									type="password"
									onChange={ev => formHandleChange(ev, setFormData)}
									name="password"
									value={formData.password}
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
							<button type="submit" className="btn btn-primary fw-secondary w-100 text-center">Register</button>
							{registerError && <p className="form-text text-danger">{registerError}</p>}
							<hr />
							<p className="form-text mb-0">Already have an account? <Link to="/">Login</Link></p>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}