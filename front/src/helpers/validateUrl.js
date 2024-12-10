export const isUrl = (aUrl) => {
  try {
    new URL(aUrl);
    return true;
  } catch (_) {
    return false;
  }
};
export const validateUrl = (value, _valueObj) => {
  if (!value) return;
  if (isUrl(value)) return;
  return 'La url no es válida';
};
