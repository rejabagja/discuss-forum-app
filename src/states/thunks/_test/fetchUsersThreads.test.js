import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../index';
import api from '@utils/api';
import { setThreadsData } from '@states/slices/threads';
import { setUsersData } from '@states/slices/users';
import { setCategoriesData } from '@states/slices/categories';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { APIError } from '@utils';

/*
fetchUsersThreads test scenarios:
1. should called fetchUsersThreads with right arguments
2. should dispatch setThreadsData, setCategoriesData and setUsersData when api.getThreads and api.getUsers resolves successfully
3. should return error object when api.getThreads or api.getUsers rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    getThreads: vi.fn(),
    getUsers: vi.fn(),
  },
}));

describe('fetchUsersThreads thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should called fetchUsersThreads with right arguments', async () => {
    const fetchUsersThreadsSpy = vi.spyOn(thunks, 'fetchUsersThreads');
    api.getThreads.mockResolvedValueOnce({ threads: [] });
    api.getUsers.mockResolvedValueOnce({ users: [] });

    await thunks.fetchUsersThreads({ signal })(dispatch, getState);
    expect(fetchUsersThreadsSpy).toHaveBeenCalledWith({ signal });

    fetchUsersThreadsSpy.mockRestore();
  });

  it('should dispatch setThreadsData, setCategoriesData and setUsersData when api.getThreads and api.getUsers resolves successfully', async () => {
    const threads = [
      { id: 'thread-1', title: 'Thread 1', category: 'category-1' },
      { id: 'thread-2', title: 'Thread 2', category: 'category-2' },
    ];
    const users = [
      { id: 'user-1', name: 'User 1' },
      { id: 'user-2', name: 'User 2' },
    ];
    const categories = [...new Set(threads.map((thread) => thread.category))];
    api.getThreads.mockResolvedValueOnce({ threads });
    api.getUsers.mockResolvedValueOnce({ users });

    const result = await thunks.fetchUsersThreads({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getThreads).toHaveBeenCalledWith({ signal });
    expect(api.getUsers).toHaveBeenCalledWith({ signal });
    expect(dispatch).toHaveBeenCalledWith(setThreadsData(threads));
    expect(dispatch).toHaveBeenCalledWith(setCategoriesData(categories));
    expect(dispatch).toHaveBeenCalledWith(setUsersData(users));
    expect(result.payload).toBeUndefined();
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should return error object when api.getUsers rejects', async () => {
    const error = new APIError('Internal Server Error', 500);
    const fakeThreadsResponse = { threads: [] };
    api.getUsers.mockRejectedValueOnce(error);
    api.getThreads.mockResolvedValueOnce(fakeThreadsResponse);

    const result = await thunks.fetchUsersThreads({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getUsers).toHaveBeenCalledWith({ signal });
    expect(api.getThreads).toHaveBeenCalledWith({ signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should return error object when api.getThreads rejects', async () => {
    const error = new APIError('Internal Server Error', 500);
    const fakeUsersResponse = { users: [] };
    api.getThreads.mockRejectedValueOnce(error);
    api.getUsers.mockResolvedValueOnce(fakeUsersResponse);

    const result = await thunks.fetchUsersThreads({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getThreads).toHaveBeenCalledWith({ signal });
    expect(api.getUsers).toHaveBeenCalledWith({ signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should handle when error.name is AbortError', async () => {
    const error = new DOMException('aborted no reason', 'AbortError');
    api.getUsers.mockRejectedValueOnce(error);
    api.getThreads.mockRejectedValueOnce(error);

    const result = await thunks.fetchUsersThreads({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getThreads).toHaveBeenCalledWith({ signal });
    expect(api.getUsers).toHaveBeenCalledWith({ signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: 'Request was aborted',
      statusCode: 408,
    });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

});