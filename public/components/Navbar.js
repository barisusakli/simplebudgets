import React from "react"

export default function Navbar(props) {
	const date = new Date();

	const yearEls = [];
	for (let i = 0; i < 10; i++) {
		const currentYear = date.getUTCFullYear() - i;
		yearEls.push(<option key={i} value={currentYear}>{currentYear}</option>)
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
					className="form-select w-auto"
					value={props.month}
					onChange={(e) => props.setMonth(e.target.value)}
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
					className="form-select w-auto"
					value={props.year}
					onChange={(e) => props.setYear(e.target.value)}
					>
					{yearEls}
				</select>
			</div>
		</div>
	)
}