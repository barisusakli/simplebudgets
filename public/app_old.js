
let budgetOptions = [];

const date = new Date();
let year = date.getUTCFullYear();
let month = date.getUTCMonth();

function refreshBudgets() {
	$.get('/budgets', { year, month }).then((budgets) => {
		budgetOptions = budgets.map(budget => budget.name);
		$('#budgets-list').empty();
		for (const budget of budgets) {
			$('#budgets-list').append(`
				<li class="d-flex flex-column gap-2">
					<div class="d-flex justify-content-between"><strong>${budget.name}</strong> ${budget.leftOrOver}</div>
					<div>
						<div class="progress position-relative" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
							<div class="progress-bar ${budget.bgColor}" style="width: ${Math.min(100, budget.percent)}%"></div>
							<div class="position-absolute border" style="border-color: black!important;left: ${budget.percentMonth}%;width: 1px;height: 100%;"></div>
						</div>
					</div>
					<div class="text-secondary">
						$${budget.current} of $${budget.amount}
					</div>
				</li>
				${budget.name === 'Total' ? '<hr/>' : ''}
			`);
		}
	});
}

function refreshTransactions() {
	$.get('/transactions', { year, month }).then((txs) => {
		$('#transaction-list tbody').empty();
		for (const tx of txs) {
			$('#transaction-list tbody').append(`
				<tr>
					<td>${tx.dateString.split('T')[0]}</td>
					<td>${tx.description}</td>
					<td>${tx.budget}</td>
					<td>$${tx.amountDollars}</td>
					<td class="text-end"><button data-id="${tx._id}" class="btn btn-sm btn-danger delete-tx lh-1">X</button></td>
				</tr>
			`);
		}
	});
}

function fillDateSelection() {
	const date = new Date();
	for (let i=0; i<10; i++) {
		const currentYear = date.getUTCFullYear() - i;
		$('#year-select').append(`<option value="${currentYear}">${currentYear}</option>`);
	}

	$('#month-select').val(date.getUTCMonth());
	$('#year-select').val(date.getUTCFullYear());

	function onDateChange() {
		year = $('#year-select').val();
		month = $('#month-select').val();
		refreshBudgets();
		refreshTransactions();
	}

	$('#month-select').on('change', onDateChange);
	$('#year-select').on('change', onDateChange);
}

refreshBudgets();
refreshTransactions();
fillDateSelection();


$('#create-budget').on('click', async () => {
	const message = `
	<label class="form-label">Name</label>
	<input class="form-control" type="text" id="name">
	<label class="form-label">Amount</label>
	<input class="form-control" type="text" id="amount">
	`;
	const dialog = bootbox.dialog({
		title: 'Create Budget',
		message: message,
		buttons: {
			save: {
				label: 'Save',
				className: 'btn-primary',
				callback: function () {
					$.post('/budgets/create', {
						name: dialog.find('#name').val(),
						amount: dialog.find('#amount').val(),
					}).then(() => {
						refreshBudgets();
					});
				}
			}
		}
	});
});

$('#create-transaction').on('click', async () => {
	const options = budgetOptions.map(option => `<option name="${option}">${option}</option>`);
	const message = `
	<label class="form-label">Budget</label>
	<select class="form-select" id="budget">${options}</select>
	<label class="form-label">Description</label>
	<input class="form-control" type="text" id="description">
	<label class="form-label">Amount</label>
	<input class="form-control" type="text" id="amount">
	<label class="form-label">Date</label>
	<input class="form-control" type="date" id="date">
	`;
	const dialog = bootbox.dialog({
		title: 'Add Transaction',
		message: message,
		buttons: {
			save: {
				label: 'Save',
				className: 'btn-primary',
				callback: function () {
					$.post('/transactions/create', {
						budget: dialog.find('#budget').val(),
						description: dialog.find('#description').val(),
						amount: dialog.find('#amount').val(),
						date: dialog.find('#date').val(),
					}).then(() => {
						refreshTransactions();
						refreshBudgets();
					});
				}
			}
		}
	});

	dialog.find('#date')[0].valueAsDate = new Date();
});

$('#transaction-list').on('click', '.delete-tx', function () {
	$.post('/transactions/delete', { _id: $(this).attr('data-id') }).then(() => {
		refreshTransactions();
		refreshBudgets();
	});
});