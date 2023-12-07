export default function formHandleChange(ev, setFormData) {
	const { name, value, type, checked } = ev.target;
	setFormData(prevData => ({
		...prevData,
		[name]: type === 'checkbox' ? checked : value
	}))
}