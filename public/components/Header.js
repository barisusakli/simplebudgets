import React from "react"

import ProfileDropdown from "./ProfileDropdown"

export default function Header({user, setUser}) {
	return (
		<nav className="d-flex justify-content-between align-items-center">
			<h1 className="fs-2 fw-semibold m-0">Simple Budget</h1>
			<ProfileDropdown user={user} setUser={setUser} />
		</nav>
	)
}