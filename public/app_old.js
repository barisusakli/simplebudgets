
let budgetOptions = [];

const date = new Date();
let year = date.getUTCFullYear();
let month = date.getUTCMonth();


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


