import React from "react"
import { Link } from "react-router-dom";
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"

export default function RegisterForm({ setUser }) {
	const [formData, setFormData] = React.useState({
		email: '',
		password: '',
		passwordConfirm: '',
	});

	async function handleSubmit(event) {
		event.preventDefault();
		if (formData.password === formData.passwordConfirm) {
			console.log('successully signed up');
		} else {
			console.log('passwords do not match');
			return;
		}

		try {
			const user = await fetchJson({
				url: '/register',
				data: formData,
				method: 'post',
			})
			setUser(user)
		} catch (err) {
			// TODO add error alerts
			console.error(err.message);
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
							<div className="mb-3">
								<label htmlFor="passwordConfirm" className="form-label">Confirm Password</label>
								<input
									className="form-control"
									type="password"
									onChange={ev => formHandleChange(ev, setFormData)}
									name="passwordConfirm"
									value={formData.passwordConfirm}
								/>
							</div>
							<button type="submit" className="btn btn-primary fw-secondary w-100 text-center">Register</button>
							<hr />
							<p className="form-text mb-0">Already have an account? <Link to="/">Login</Link></p>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}