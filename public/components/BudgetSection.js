import React from 'react';

import formatCentsToDollars from '../format';

export default function BudgetSection({ children, current, total, title }) {
	return (
		<div>
			<div className="border-bottom pb-1 mb-3 d-flex gap-2 justify-content-between align-items-center">
				<h5 className="fw-semibold mb-0">{title}</h5>
				<div className="fs-6">
					<span className="fw-semibold">{formatCentsToDollars(current)}</span> of {formatCentsToDollars(total)}
				</div>
			</div>
			<div className="d-flex flex-column gap-3 ms-0 ms-lg-1">
				{children}
			</div>
		</div>
	);
}
