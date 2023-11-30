import React from "react"
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm({ setUser }) {
	const [formData, setFormData] = React.useState({
		email: '',
		password: '',
	});

	function handleChange(ev) {
		const { name, value, type, checked } = ev.target;
		setFormData(prevData => ({
			...prevData,
			[name]: type === 'checkbox' ? checked : value
		}))
	}
	const navigate = useNavigate();
	async function handleSubmit(event) {
		event.preventDefault();
		if (!formData.email || !formData.password) {
			return;
		}

		console.log(formData)
		// TODO: send login request
		await postJSON(formData);
		navigate('/dashboard');
	}

	async function postJSON(data) {
		try {
			const response = await fetch("/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			const result = await response.json();
			console.log("Success:", result);
			setUser({ email: data.email })
		} catch (error) {
			console.error("Error:", error);
			throw error;
		}
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
									onChange={handleChange}
									name="email"
									value={formData.email}
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="password" className="form-label">Password</label>
								<input
									className="form-control"
									type="password"
									onChange={handleChange}
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