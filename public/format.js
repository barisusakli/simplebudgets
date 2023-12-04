export default function formatCentsToDollars(value) {
	return (value / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
}

export function centsToDollars(value) {
	value = String(value).replace(/[^\d.-]/g, '');
	value = parseFloat(value);
	return value ? value / 100 : 0;
}

export function getYYYYmmdd(date) {
	let month = '' + (date.getMonth() + 1);
	let day = '' + date.getDate();
	let year = date.getFullYear();

	if (month.length < 2) {
		month = '0' + month;
	}
	if (day.length < 2) {
		day = '0' + day;
	}

	return [year, month, day].join('-');
}