const BASE_URL = import.meta.env.VITE_BASE_API_URL;
const VoteType = {
  UP_VOTE: 'up-vote',
  DOWN_VOTE: 'down-vote',
  NEUTRAL_VOTE: 'neutral-vote'
};

function setAccessToken(token) {
  localStorage.setItem('token', token);
}

function getAccessToken() {
  return localStorage.getItem('token');
}

function removeAccessToken() {
  localStorage.removeItem('token');
}

async function register({ name, email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function login({ email, password }) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function getUsers() {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    if (!response.ok) throw new Error('failed get users.');
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
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

async function getOwnProfile() {
  try {
    const response = await _fetchWithToken(`${BASE_URL}/users/me`);
    if (!response.ok) throw new Error('failed get own profile.');
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function createThread({ title, body, category = '' }) {
  try {
    const response = await _fetchWithToken(`${BASE_URL}/threads`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        category
      })
    });
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function getThreads() {
  try {
    const response = await fetch(`${BASE_URL}/threads`);
    if (!response.ok) throw new Error('failed get threads.');
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function getThreadDetail(threadId) {
  try {
    const response = await fetch(`${BASE_URL}/threads/${threadId}`);
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function createComment({ threadId, content }) {
  try {
    const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        content
      })
    });
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function setVoteThread(threadId, voteType = VoteType.NEUTRAL_VOTE) {
  try {
    const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/${voteType}`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error(`failed set vote to ${voteType}.`);
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function setVoteComment({ threadId, commentId, voteType = VoteType.NEUTRAL_VOTE }) {
  try {
    const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments/${commentId}/${voteType}`, {
      method: 'POST'
    });
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
}

async function getLeaderBoards() {
  try {
    const response = await fetch(`${BASE_URL}/leaderboards`);
    const { status, message, data } = await response.json();
    if (status !== 'success') throw new Error(message);
    return data;
  } catch (error) {
    return Promise.reject(error.message);
  }
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
  VoteType,
  setAccessToken,
  getAccessToken,
  removeAccessToken,
};

export default api;