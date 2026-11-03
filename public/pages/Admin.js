import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

import Header from '../components/Header';
import fetchJson from '../fetchJson';
import useAlert from '../hooks/useAlert';

export default function Admin() {
	const navigate = useNavigate();
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
		}).catch(err => {
			if (/not found/i.test(err.message)) {
				navigate('/dashboard', { replace: true });
			} else {
				setAlert(err.message, 'danger');
			}
		});
	}, [navigate, setAlert]);

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
								<th className="text-end">Transactions</th>
								<th className="text-end">Budgets</th>
							</tr>
						</thead>
						<tbody className="text-tabular">
							{users.map((user) => (
								<tr key={user._id}>
									<td>{user.email}</td>
									<td className="text-end">{user.numTransactions}</td>
									<td className="text-end">{user.numBudgets}</td>
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
