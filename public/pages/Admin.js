import React, { useState, useEffect } from 'react';

import Header from '../components/Header';
import fetchJson from '../fetchJson';
import useAlert from '../hooks/useAlert';

export default function Admin() {
	const [users, setUsers] = useState([]);
	const [isLoaded, setIsLoaded] = useState(false);
	const { setAlert } = useAlert();

	useEffect(() => {
		fetchJson({
			url: '/api/admin',
			method: 'get',
		}).then((data) => {
			setUsers(data.users);
			setIsLoaded(true);
		}).catch(err => setAlert(err.message, 'danger'));
	}, [setAlert]);

	return (
		<section className="section d-flex flex-column gap-3 pb-5 mb-5 mb-lg-0">
			<Header />
			<div className="card shadow-sm border-0">
				<div className="card-body">
					{ isLoaded &&
					<table className="table table-hover align-middle">
						<thead>
							<tr>
								<th>Email</th>
								<th>Transactions</th>
								<th>Budgets</th>
							</tr>
						</thead>
						<tbody>
							{users.map((user) => (
								<tr key={user._id}>
									<td>{user.email}</td>
									<td>{user.numTransactions}</td>
									<td>{user.numBudgets}</td>
								</tr>
							))}
						</tbody>
					</table>
					}
				</div>
			</div>
		</section>
	);
}
