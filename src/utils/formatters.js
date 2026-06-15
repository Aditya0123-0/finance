export function normalizePhone(value = '') {
  return value.replace(/[^\d+]/g, '');
}
