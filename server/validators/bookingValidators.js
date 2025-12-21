// Email validation
export function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Phone validation (10–15 digits, allows spaces or hyphens)
export function validatePhone(phone) {
  const cleaned = phone.replace(/[\s-]/g, '');
  const regex = /^[0-9]{10,15}$/;
  return regex.test(cleaned);
}

// Name validation (2–100 characters)
export function validateName(name) {
  return typeof name === 'string' && name.length >= 2 && name.length <= 100;
}
