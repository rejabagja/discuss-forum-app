import parser from 'html-react-parser';
import DOMPurify from 'dompurify';
import truncate from 'truncate-html';


function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value > 0) {
      return `${value} ${key}${value > 1 ? 's' : ''} ago`;
    }
  }

  return 'Just now';
}

function parseHtmlStringWithTrim(htmlString, limit) {
  const sanitizedHtml = DOMPurify.sanitize(htmlString);
  const truncatedHtml = truncate(sanitizedHtml, limit);
  return parser(truncatedHtml);
}

function parseHtmlString(htmlString) {
  const sanitizedHtml = DOMPurify.sanitize(htmlString);
  return parser(sanitizedHtml);
}

export { timeAgo, parseHtmlStringWithTrim, parseHtmlString };
