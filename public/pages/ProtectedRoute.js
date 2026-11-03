import React from 'react';
import { Navigate } from 'react-router';

export default function ProtectedRoute({ children, user, isLoading }) {
	if (isLoading) {
		return null;
	}
	if (!user) {
		return <Navigate to="/" replace />;
	}
	return children;
}
