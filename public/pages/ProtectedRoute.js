import React from 'react';
import { Navigate } from 'react-router';

export default function ProtectedRoute({ children, user }) {
	if (!user) {
		return <Navigate to="/" />;
	}
	return children;
}
