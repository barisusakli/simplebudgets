import React from "react"
import fetchJson from "../fetchJson"

export default function ProfileDropdown({ user, setUser }) {
	async function handleLogout() {
		await fetchJson({
			url: '/logout',
			method: 'post',
		});
		setUser(null);
	}

	return (
		<div className="dropdown">
			<button className="btn btn-sm btn-light ff-secondary" data-bs-toggle="dropdown">{user.email}</button>
			<ul className="dropdown-menu dropdown-menu-end p-1">
				<li><a className="dropdown-item rounded-1" href="#" onClick={handleLogout}>Logout</a></li>
			</ul>
		</div>
	)
}