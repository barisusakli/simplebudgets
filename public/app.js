import { BrowserRouter, Routes, Route } from "react-router-dom"

import React, { useEffect } from "react"

import SharedLayout from "./pages/SharedLayout"
import Landing from "./pages/Landing"
import ProtectedRoute from "./pages/ProtectedRoute"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"
import Reset from "./pages/Reset"

import fetchJson from "./fetchJson"

export default function App() {
	const [user, setUser] = React.useState(null)
	const [isLoading, setIsLoading] = React.useState(true)

	useEffect(() => {
		fetchJson({
			url: '/user',
		}).then((result) => {
			if (result) {
				console.log(result);
				setUser({ email: result.email })
			}
		}).catch(err => {
			console.log(err);
		}).finally(() => {
			setIsLoading(false);
		})
	}, [])

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SharedLayout />}>
					<Route index element={<Landing user={user} setUser={setUser} />} />
					<Route path="register" element={<Register user={user} setUser={setUser} />} />
					<Route path="reset" element={<Reset user={user} />} />
					<Route path="reset/:code" element={<Reset user={user} />} />
					<Route path="dashboard" element={
						<ProtectedRoute user={user}>
							<Dashboard user={user} setUser={setUser} />
						</ProtectedRoute>
					} />
					<Route path="*" element={<Error />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}