import { BrowserRouter, Routes, Route } from "react-router-dom"

import React from "react"

import SharedLayout from "./pages/SharedLayout"
import Landing from "./pages/Landing"
import ProtectedRoute from "./pages/ProtectedRoute"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Error from "./pages/Error"

export default function App() {
	const [user, setUser] = React.useState({ email: 'asdasd' })

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<SharedLayout />}>
					<Route index element={<Landing user={user} setUser={setUser} />} />

					<Route path="register" element={<Register user={user} setUser={setUser} />} />
					<Route path="dashboard" element={
						<ProtectedRoute user={user}>
							<Dashboard user={user} />
						</ProtectedRoute>
					} />
					<Route path="*" element={<Error />} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}