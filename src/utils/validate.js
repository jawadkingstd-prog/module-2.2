export function validateCustomer(form) {
  const errors = {};

  if (!form.name || !form.name.trim()) {
    errors.name = "Name cannot be empty.";
  }

  if (!form.phone || !form.phone.trim()) {
    errors.phone = "Phone number cannot be empty.";
  } else if (!/^\d{10,15}$/.test(form.phone.trim())) {
    errors.phone = "Phone number must contain only digits and be 10–15 characters long.";
  }

  if (!form.email || !form.email.trim()) {
    errors.email = "Email cannot be empty.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Email must be in a valid email format.";
  }

  if (!form.address || !form.address.trim()) {
    errors.address = "Address cannot be empty.";
  }

  return errors;
}
