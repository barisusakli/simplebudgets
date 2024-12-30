import { BrowserRouter, Routes, Route } from 'react-router';

import React from 'react';

import SharedLayout from './pages/SharedLayout';
import Landing from './pages/Landing';
import ProtectedRoute from './pages/ProtectedRoute';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Error from './pages/Error';
import Reset from './pages/Reset';

import useData from './hooks/useData';
import UserContext from './contexts/UserContext';
import AlertPopup from './components/AlertPopup';

export default function App() {
	const [{ data: user, state }, { setData }] = useData('/api/user', null);
	const isLoading = state !== 'success';

	return (
		<div className="container-lg">
			<BrowserRouter>
				<UserContext value={{ user, setUser: setData }}>
					<Routes>
						<Route path="/" element={<SharedLayout />}>
							<Route index element={<Landing isLoading={isLoading} />} />
							<Route path="register" element={<Register />} />
							<Route path="reset" element={<Reset />} />
							<Route path="reset/:code" element={<Reset />} />
							<Route path="dashboard" element={
								<ProtectedRoute user={user}>
									<Dashboard />
								</ProtectedRoute>
							} />
							<Route path="*" element={<Error />} />
						</Route>
					</Routes>
				</UserContext>
			</BrowserRouter>
			<AlertPopup />
		</div>
	);
}
