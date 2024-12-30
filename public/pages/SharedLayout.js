import React from 'react';
import { Outlet } from 'react-router';

export default function SharedLayout() {
	return (
		<div className="row mt-4">
			<div className="col-12 col-lg-8 mx-auto">
				<Outlet />
			</div>
		</div>
	);
}
