import React from 'react';
import { Link } from 'react-router';

export default function Error() {
	return (
		<section className="section d-flex flex-column gap-3 align-items-center">
			<div className="card shadow-sm">
				<div className="card-body text-center p-5">
					<h2>404</h2>
					<p>Page not found</p>
					<Link to="/" className="btn btn-light btn-sm">
						Return Home
					</Link>
				</div>
			</div>
		</section>
	);
}
