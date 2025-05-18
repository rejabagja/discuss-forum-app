import { AppError } from './index';
import { ErrorType, BASE_URL } from '@constants';


function setAccessToken(token) {
  localStorage.setItem('token', token);
}

function getAccessToken() {
  return localStorage.getItem('token');
}

function removeAccessToken() {
  localStorage.removeItem('token');
}

async function register(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.CREATE_USER);
    }
    return { ...data, message };
  } catch (error) {
    return Promise.reject(error);
  }
}

async function login(credentials) {
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials)
    });
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.LOGIN);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getUsers() {
  try {
    const response = await fetch(`${BASE_URL}/users`);
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.FETCH_DATA);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
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
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.FETCH_DATA);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function createThread(payload) {
  try {
    const response = await _fetchWithToken(`${BASE_URL}/threads`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.CREATE_THREAD);
    }
    return { ...data, message };
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getThreads() {
  try {
    const response = await fetch(`${BASE_URL}/threads`);
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.FETCH_DATA);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getThreadDetail(threadId) {
  try {
    const response = await fetch(`${BASE_URL}/threads/${threadId}`);
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.FETCH_DATA);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function createComment(payload) {
  try {
    const { threadId, content } = payload;
    const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        content
      })
    });
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.CREATE_COMMENT);
    }
    return { ...data, message };
  } catch (error) {
    return Promise.reject(error);
  }
}

async function setVoteThread(threadId, voteType) {
  try {
    const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/${voteType}`, {
      method: 'POST'
    });
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      const error = new AppError(message ?? response.statusText, response.status, ErrorType.VOTE_THREAD);
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function setVoteComment(payload) {
  try {
    const { threadId, commentId, voteType } = payload;
    const response = await _fetchWithToken(`${BASE_URL}/threads/${threadId}/comments/${commentId}/${voteType}`, {
      method: 'POST'
    });
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      const error = new AppError(message ?? response.statusText, response.status, ErrorType.VOTE_COMMENT);
      return Promise.reject(error);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

async function getLeaderBoards() {
  try {
    const response = await fetch(`${BASE_URL}/leaderboards`);
    const { status, message, data } = await response.json();
    if (status !== 'success' || response.status >= 400) {
      throw new AppError(message ?? response.statusText, response.status, ErrorType.FETCH_DATA);
    }
    return data;
  } catch (error) {
    return Promise.reject(error);
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
  setAccessToken,
  getAccessToken,
  removeAccessToken,
};

export default api;