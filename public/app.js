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

import UserContext from "./contexts/UserContext"
import AlertPopup from "./components/AlertPopup"
import useAlert from "./hooks/useAlert"

export default function App() {
	const [user, setUser] = React.useState(null)
	const [isLoading, setIsLoading] = React.useState(true)
	const { setAlert } = useAlert()

	useEffect(() => {
		fetchJson({
			url: '/api/user',
		}).then((result) => {
			if (result) {
				setUser({ email: result.email, joined: result.joined })
			}
		}).catch(err => {
			setAlert(err.message, 'danger')
		}).finally(() => {
			setIsLoading(false);
		})
	}, [])

	return (
		<div className="container-lg">
			<BrowserRouter>
				<UserContext.Provider value={{ user, setUser }}>
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
				</UserContext.Provider>
			</BrowserRouter>
			<AlertPopup />
		</div>
	)
}