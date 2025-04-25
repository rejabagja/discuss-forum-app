import parser from 'html-react-parser';
import DOMPurify from 'dompurify';


export const timeAgo = (date) => {
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
};

export const parseHtmlString = (htmlString) => {
  const sanitizedHtml = DOMPurify.sanitize(htmlString);
  return parser(sanitizedHtml);
};

export const leaderboardRingColor = (order) => {
  switch (order) {
  case 1:
    return 'ring-yellow-400';
  case 2:
    return 'ring-gray-300';
  case 3:
    return 'ring-yellow-900';
  default:
    return 'ring-base-200';
  }
};