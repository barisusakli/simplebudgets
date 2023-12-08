import React from "react"

import useUser from "../hooks/useUser";

export default function Navbar(props) {
	const { user } = useUser();

	const currentYear = new Date().getFullYear();
	const joinedYear = new Date(user.joined).getFullYear();

	const yearEls = [];
	for (let i = currentYear; i >= joinedYear; --i) {
	 	yearEls.push(<option key={i} value={i}>{i}</option>)
	}

	return (
		<div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
			<ul className="nav nav-underline" id="myTab" role="tablist">
				<li className="nav-item" role="presentation">
					<button className="nav-link active" id="budgets-tab" data-bs-toggle="tab" data-bs-target="#budgets-tab-pane" type="button" role="tab" aria-controls="budgets-tab-pane" aria-selected="true">Budgets</button>
				</li>
				<li className="nav-item" role="presentation">
					<button className="nav-link" id="transactions-tab" data-bs-toggle="tab" data-bs-target="#transactions-tab-pane" type="button" role="tab" aria-controls="transactions-tab-pane" aria-selected="false">Transactions</button>
				</li>
			</ul>

			<div className="d-flex gap-1">
				<select id="month-select"
					className="form-select form-select-sm w-auto"
					value={props.month}
					onChange={(e) => props.setMonth(parseInt(e.target.value, 10))}
					>
					<option value="0">January</option>
					<option value="1">February</option>
					<option value="2">March</option>
					<option value="3">April</option>
					<option value="4">May</option>
					<option value="5">June</option>
					<option value="6">July</option>
					<option value="7">August</option>
					<option value="8">September</option>
					<option value="9">October</option>
					<option value="10">November</option>
					<option value="11">December</option>
				</select>

				<select id="year-select"
					className="form-select form-select-sm w-auto"
					value={props.year}
					onChange={(e) => props.setYear(parseInt(e.target.value, 10))}
					>
					{yearEls}
				</select>
			</div>
		</div>
	)
}