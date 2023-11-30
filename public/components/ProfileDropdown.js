import React from "react"
import fetchJson from "../fetchJson"
import { useNavigate } from "react-router-dom";

export default function ProfileDropdown({ setUser }) {
	const navigate = useNavigate();

	async function handleLogout() {
		await fetchJson({
			url: '/logout',
			method: 'post',
		});
		setUser(null);
		navigate('/');
	}

	return (
		<div className="dropdown">
			<button className="btn btn-light" data-bs-toggle="dropdown">Profile</button>
			<ul className="dropdown-menu dropdown-menu-end p-1">
				<li><a className="dropdown-item rounded-1" href="#">item 1</a></li>
				<li><a className="dropdown-item rounded-1" href="#">item 1</a></li>
				<li><a className="dropdown-item rounded-1" href="#" onClick={handleLogout}>Logout</a></li>
			</ul>
		</div>
	)
}