import React, { useState } from "react"
import fetchJson from "../fetchJson"
import ChangePasswordModal from "./ChangePasswordModal";

export default function ProfileDropdown({ user, setUser }) {
	const [showChangeEmail, setShowChangeEmail] = useState(false)
	const [showChangePassword, setShowChangePassword] = useState(false)

	async function handleLogout() {
		await fetchJson({
			url: '/logout',
			method: 'post',
		});
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
				showChangePassword &&
				<ChangePasswordModal
					setUser={setUser}
					onHidden={() => setShowChangePassword(false)}/>
			}
		</>
	)
}