import { APIError } from './index';
import { BASE_URL } from '@constants';


function setAccessToken(token) {
  localStorage.setItem('token', token);
}

function getAccessToken() {
  return localStorage.getItem('token');
}

function removeAccessToken() {
  localStorage.removeItem('token');
}

async function register(credentials, options = {}) {
  const response = await fetch(`${BASE_URL}/register`, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function login(credentials, options = {}) {
  const response = await fetch(`${BASE_URL}/login`, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function getUsers(options = {}) {
  const response = await fetch(`${BASE_URL}/users`, options);
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function _fetchWithToken(url, options = {}) {
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getAccessToken()}`,
      ...options.headers,
    }
  });
};

async function getOwnProfile(options = {}) {
  const response = await _fetchWithToken(`${BASE_URL}/users/me`, options);
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function createThread(payload, options = {}) {
  const response = await _fetchWithToken(`${BASE_URL}/threads`, {
    ...options,
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function getThreads(options = {}) {
  const response = await fetch(`${BASE_URL}/threads`, options);
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function getThreadDetail(threadId, options = {}) {
  const response = await fetch(`${BASE_URL}/threads/${threadId}`, options);
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function createComment(payload, options = {}) {
  const { threadId, content } = payload;
  const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments`, {
    ...options,
    method: 'POST',
    body: JSON.stringify({
      content
    })
  });
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function setVoteThread(threadId, voteType, options = {}) {
  const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/${voteType}`, {
    ...options,
    method: 'POST'
  });
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function setVoteComment(payload, options = {}) {
  const { threadId, commentId, voteType } = payload;
  const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments/${commentId}/${voteType}`, {
    ...options,
    method: 'POST'
  });
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

async function getLeaderBoards(options = {}) {
  const response = await fetch(`${BASE_URL}/leaderboards`, options);
  if (!response.ok) {
    const { message } = await response.json();
    throw new APIError(message ?? response.statusText, response.status);
  }
  return response.json();
}

const api = {
  register,
  login,
  getUsers,
  getOwnProfile,
  createThread,
  getThreads,
  getThreadDetail,
  createComment,
  setVoteThread,
  setVoteComment,
  getLeaderBoards,
  setAccessToken,
  getAccessToken,
  removeAccessToken,
};

export default api;