import React from "react"
import { Link } from "react-router-dom";
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"

export default function LoginForm({ setUser }) {
	const [formData, setFormData] = React.useState({
		email: '',
		password: '',
	});

	async function handleSubmit(event) {
		event.preventDefault();
		if (!formData.email || !formData.password) {
			return;
		}

		await fetchJson({
			url: '/login',
			data: formData,
			method: 'post',
		}).then((loggedInUser) => {
			setUser(loggedInUser)
		})
	}

	return (
		<div className="row justify-content-center">
			<div className="col-12 col-md-6">
				<div className="card shadow-sm">
					<div className="card-body">
						<form onSubmit={handleSubmit} className="">
							<div className="mb-3">
								<label htmlFor="email" className="form-label">Email</label>
								<input
									className="form-control"
									type="email"
									placeholder="your@email.com"
									onChange={ev => formHandleChange(ev, setFormData)}
									name="email"
									value={formData.email}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">Password</label>
								<input
									className="form-control"
									type="password"
									onChange={ev => formHandleChange(ev, setFormData)}
									name="password"
									value={formData.pasword}
								/>
							</div>
							<button type="submit" className="btn btn-primary fw-secondary w-100 text-center">Login</button>
							<hr />
							<p className="form-text mb-0">Don't have an account? <Link to="/register">Register</Link></p>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}