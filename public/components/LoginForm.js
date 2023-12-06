import React, { useState, useRef } from "react"
import { Link } from "react-router-dom";
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function LoginForm({ setUser }) {
	const captchaRef = useRef(null);

	const [formData, setFormData] = React.useState({
		email: '',
		password: '',
		hcaptchaToken: ''
	});

	const [loginError, setLoginError] = useState('');

	async function handleSubmit(event) {
		event.preventDefault();
		if (!formData.email || !formData.password) {
			return;
		}
		try {
			const loggedInUser = await fetchJson({
				url: '/api/login',
				data: formData,
				method: 'post',
			})
			setUser(loggedInUser)
		} catch (err) {
			setLoginError(err.message)
		} finally {
			captchaRef.current.resetCaptcha()
		}
	}

	function handleVerificationSuccess(token, ekey) {
		setFormData(prevData => ({
			...prevData,
			hcaptchaToken: token,
		}))
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
									autoComplete="on"
								/>
							</div>
							<div className="mb-3">
								<div className="d-flex justify-content-between align-items-center">
									<label htmlFor="password" className="form-label">Password</label>
									<Link to="/reset" className="text-sm mb-2">Forgot password?</Link>
								</div>
								<input
									id="password"
									className="form-control"
									type="password"
									onChange={ev => formHandleChange(ev, setFormData)}
									name="password"
									value={formData.password}
									required
									autoComplete="on"
								/>
							</div>

							<div className="mb-3">
								<HCaptcha
									ref={captchaRef}
									sitekey="d76f5317-946c-48e0-90aa-931c916c1d7d"
									onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)}
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