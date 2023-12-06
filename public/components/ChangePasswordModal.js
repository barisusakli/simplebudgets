import React, { useState, useRef, useEffect } from "react"
import fetchJson from "../fetchJson"
import formHandleChange from "../formHandleChange"
import { Modal } from 'bootstrap'

export default function ChangePasswordModal({ setUser, onHidden }) {
	const [formData, setFormData] = useState({
		password: '',
		newpassword: '',
		passwordConfirm: '',
	})
	const [errorMsg, setErrorMsg] = useState('')
	const myModalEl = useRef(null)

	const noMatch = formData.newpassword && formData.passwordConfirm && formData.newpassword !== formData.passwordConfirm;

	function handleSubmit(ev) {
		ev.preventDefault()

		if (!formData.password || !formData.passwordConfirm || noMatch) {
			return
		}

		fetchJson({
			url: '/api/password/change',
			data: formData,
			method: 'post',
		}).then(() => {
			hideModal()
			setUser(null)
		}).catch((err) => {
			setErrorMsg(err.message)
		})
	}

	function showModal() {
		const myModal = Modal.getOrCreateInstance(myModalEl.current)
		myModal.show()
	}

	function hideModal() {
		const myModal = Modal.getOrCreateInstance(myModalEl.current)
		myModal.hide()
	}

	useEffect(() =>{
		showModal()
		if (onHidden) {
			myModalEl.current.addEventListener('hidden.bs.modal', onHidden, { once: true })
		}
	}, [])

	return (
		<div ref={myModalEl} className="modal" tabIndex="-1">
			<div className="modal-dialog">
				<div className="modal-content">
					<form onSubmit={handleSubmit}>
						<div className="modal-header">
							<h5 className="modal-title">Change Password</h5>
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
									autoComplete="off"
								/>
							</div>
							<div className="mb-3">
								<label htmlFor="newpassword" className="form-label">New Password</label>
								<input
									id="newpassword"
									className="form-control"
									type="password"
									onChange={ev => formHandleChange(ev, setFormData)}
									name="newpassword"
									value={formData.newpassword}
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
							{ errorMsg && <div><hr/><p className="text-danger">{errorMsg}</p></div>}
						</div>
						<div className="modal-footer">
							<p className="form-text text-danger">Changing your password will log you out.</p>
							<button type="submit" className="btn btn-primary">Save</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}