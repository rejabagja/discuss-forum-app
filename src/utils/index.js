import parser from 'html-react-parser';
import DOMPurify from 'dompurify';
import { toast } from 'react-toastify';
import React from 'react';
import { Link } from 'react-router-dom';


export const formatTimeAgo = (date) => {
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

export class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
  }
}

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

export const showAuthRequiredToast = (action) => {
  const toastContent = React.createElement(
    'div',
    null,
    'You must be ',
    React.createElement(
      Link,
      { to: '/login', className: 'text-blue-500 underline font-medium' },
      'logged in'
    ),
    ' to perform ',
    action,
    ' action.'
  );
  toast.info(toastContent, {
    toastId: 'auth-required',
    autoClose: 3000,
  });
};

export const getInitialTheme = () => {
  const theme = localStorage.getItem('theme');
  return ['light', 'dark'].includes(theme) ? theme : 'light';
};

export const setAppTheme = (theme) => localStorage.setItem('theme', theme);