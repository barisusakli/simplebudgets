export default function formatCentsToDollars(value) {
	return (value / 100).toLocaleString('en-CA', { style: 'currency', currency: 'CAD' })
}