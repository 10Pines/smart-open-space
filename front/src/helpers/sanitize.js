import DOMPurify from 'dompurify';

export const sanitizeHtml = (content, options = {}) => {
  if (typeof content !== 'string') return content;
  return DOMPurify.sanitize(content, options);
};

export default sanitizeHtml;
