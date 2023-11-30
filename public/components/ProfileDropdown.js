import React from "react"
export default function ProfileDropdown() {
	return (
		<div className="dropdown">
			<button className="btn btn-light" data-bs-toggle="dropdown">Profile</button>
			<ul className="dropdown-menu dropdown-menu-end p-1">
				<li><a className="dropdown-item rounded-1" href="#">item 1</a></li>
				<li><a className="dropdown-item rounded-1" href="#">item 1</a></li>
				<li><a className="dropdown-item rounded-1" href="#">Logout</a></li>
			</ul>
		</div>
	)
}