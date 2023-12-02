export default function formatCentsToDollars(value) {
	return (value / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
}

export function centsToDollars(value) {
	value = String(value).replace(/[^\d.-]/g, '');
	value = parseFloat(value);
	return value ? value / 100 : 0;
}