import React, { useState } from "react"
import fetchJson from "../fetchJson"
import ChangePasswordModal from "./ChangePasswordModal";
import ChangeEmailModal from "./ChangeEmailModal";
import useAlert from "../hooks/useAlert";
import useUser from "../hooks/useUser";

export default function ProfileDropdown() {
	const { user, setUser } = useUser();
	const [showChangeEmail, setShowChangeEmail] = useState(false)
	const [showChangePassword, setShowChangePassword] = useState(false)
	const { setAlert } = useAlert()
	async function handleLogout() {
		await fetchJson({
			url: '/api/logout',
			method: 'post',
		}).catch(err => setAlert(err.message, 'danger'));
		setUser(null);
	}

	return (
		<>
			<div className="dropdown">
				<button className="btn btn-sm btn-light ff-secondary" data-bs-toggle="dropdown">{user.email.split('@')[0]}</button>
				<ul className="dropdown-menu dropdown-menu-end p-1">
					<li><a className="dropdown-item rounded-1" href="#" onClick={() => setShowChangeEmail(true)}>Change Email</a></li>
					<li><a className="dropdown-item rounded-1" href="#" onClick={() => setShowChangePassword(true)}>Change Password</a></li>
					<li className="dropdown-divider"></li>
					<li><a className="dropdown-item rounded-1" href="#" onClick={handleLogout}>Logout</a></li>
				</ul>
			</div>
			{
				showChangeEmail &&
				<ChangeEmailModal
					onEmailChanged={() => setUser(null)}
					onHidden={() => setShowChangeEmail(false)}/>
			}
			{
				showChangePassword &&
				<ChangePasswordModal
					onPasswordChanged={() => setUser(null)}
					onHidden={() => setShowChangePassword(false)}/>
			}
		</>
	)
}