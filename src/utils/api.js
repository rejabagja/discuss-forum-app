import { APIError } from './index';
import { BASE_URL } from '@constants';


// Token management
function setAccessToken(token) {
  localStorage.setItem('token', token);
}

function getAccessToken() {
  return localStorage.getItem('token');
}

function removeAccessToken() {
  localStorage.removeItem('token');
}

// response error handler
async function handleResponseError(response) {
  let message = response.statusText;
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const body = await response.json();
      message = body.message ?? response.statusText;
    } else {
      await response.text();
    }
  } catch (error) {
    console.warn(error);
  }
  throw new APIError(message, response.status);
}

// fetch internal with token
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

// fetcher
async function register(payload, options = {}) {
  const response = await fetch(`${BASE_URL}/register`, {
    ...options,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { message, data: { user } } = await response.json();
  return { message, user };
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
    await handleResponseError(response);
  }
  const { data: { token }, message } = await response.json();
  return { token, message };
}

async function getOwnProfile(options = {}) {
  const response = await _fetchWithToken(`${BASE_URL}/users/me`, options);
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { data: { user }, message } = await response.json();
  return { user, message };
}

async function getUsers(options = {}) {
  const response = await fetch(`${BASE_URL}/users`, options);
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { data: { users }, message } = await response.json();
  return { users, message };
}

async function getThreads(options = {}) {
  const response = await fetch(`${BASE_URL}/threads`, options);
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { data: { threads }, message } = await response.json();
  return { threads, message };
}

async function createThread(payload, options = {}) {
  const response = await _fetchWithToken(`${BASE_URL}/threads`, {
    ...options,
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { data: { thread }, message } = await response.json();
  return { thread, message };
}

async function getThreadDetail(threadId, options = {}) {
  const response = await fetch(`${BASE_URL}/threads/${threadId}`, options);
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { data: { detailThread }, message } = await response.json();
  return { detailThread, message };
}

async function setVoteThread(threadId, voteType, options = {}) {
  const response = await _fetchWithToken(
    `${BASE_URL}/threads/${threadId}/${voteType}`,
    {
      ...options,
      method: 'POST',
    }
  );
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { data: { vote }, message } = await response.json();
  return { vote, message };
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
    await handleResponseError(response);
  }
  const { data: { comment }, message } = await response.json();
  return { comment, message };
}

async function setVoteComment(payload, options = {}) {
  const { threadId, commentId, voteType } = payload;
  const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments/${commentId}/${voteType}`, {
    ...options,
    method: 'POST'
  });
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { data: { vote }, message } = await response.json();
  return { vote, message };
}

async function getLeaderBoards(options = {}) {
  const response = await fetch(`${BASE_URL}/leaderboards`, options);
  if (!response.ok) {
    await handleResponseError(response);
  }
  const { data: { leaderboards }, message } = await response.json();
  return { leaderboards, message };
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