import React, { useState, useRef } from 'react';
import fetchJson from '../fetchJson';
import formHandleChange from '../formHandleChange';
import Modal from './Modal';

export default function ChangeEmailModal({ onEmailChanged, onHidden }) {
	const [formData, setFormData] = useState({
		password: '',
		email: '',
	});
	const [errorMsg, setErrorMsg] = useState('');
	const myModalEl = useRef(null);

	function handleSubmit(ev) {
		ev.preventDefault();

		if (!formData.password || !formData.email) {
			return;
		}

		fetchJson({
			url: '/api/email/change',
			data: formData,
			method: 'post',
		}).then(() => {
			myModalEl.current.hide();
			onEmailChanged();
		}).catch((err) => {
			setErrorMsg(err.message);
		});
	}

	return (
		<Modal ref={myModalEl} onHidden={onHidden}>
			<form onSubmit={handleSubmit}>
				<div className="modal-header">
					<h5 className="modal-title">Change Email</h5>
					<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div className="modal-body">
					<div className="mb-3">
						<label htmlFor="password" className="form-label">Current Password</label>
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
							autoComplete="current-password"
						/>
					</div>
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
							autoComplete="new-email"
						/>
					</div>
					{ errorMsg && <div><hr/><p className="text-danger">{errorMsg}</p></div>}
				</div>
				<div className="modal-footer">
					<p className="form-text text-danger">Changing your email will log you out.</p>
					<button type="submit" className="btn btn-primary">Save</button>
				</div>
			</form>
		</Modal>
	);
}
