import React from "react"

// import { Link } from "react-router-dom"

import Header from "../components/Header"
import Navbar from "../components/Navbar"
import Main from "../components/Main"

export default function Dashboard({ user }) {
	// TODO add states for budgets/transactions

	return (
		<section className="section d-flex flex-column gap-2">
			<Header user={user} />
			<Navbar/>
			<Main />
		</section>
	)
}
