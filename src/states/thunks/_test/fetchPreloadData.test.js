import { describe, it, expect, vi, beforeEach } from 'vitest';
import { APIError } from '@utils';
import * as thunks from '../index';
import api from '@utils/api';
import { setAuthUser } from '@states/slices/auth';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

/*
fetchPreloadData test scenarios:
1. should called fetchPreloadData with right arguments
2. should handle when token is missing
3. should called api.removeAccessToken when api.getOwnProfile rejects and error.statusCode is 401
4. should dispatch setAuthUser when token is present and api.getOwnProfile resolves successfully
5. should return error object when api.getOwnProfile rejects and error.statusCode is not 401
6. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    getOwnProfile: vi.fn(),
    removeAccessToken: vi.fn(),
    getAccessToken: vi.fn(),
  },
}));

describe('fetchPreloadData thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should called fetchPreloadData with right arguments', async () => {
    const fetchPreloadDataSpy = vi.spyOn(thunks, 'fetchPreloadData');
    api.getAccessToken.mockReturnValueOnce('valid-token');
    api.getOwnProfile.mockResolvedValueOnce({ user: { id: 1 } });

    await thunks.fetchPreloadData({ signal })(dispatch, getState);
    expect(fetchPreloadDataSpy).toHaveBeenCalledWith({ signal });

    fetchPreloadDataSpy.mockRestore();
  });

  it('should handle when token is missing', async () => {
    api.getAccessToken.mockReturnValueOnce(null);

    const result = await thunks.fetchPreloadData({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getAccessToken).toHaveBeenCalled();
    expect(api.getAccessToken.mock.results[0].value).toBeNull();
    expect(api.getOwnProfile).not.toHaveBeenCalled();
    expect(result.payload).toBeUndefined();
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should called api.removeAccessToken when api.getOwnProfile rejects and error.statusCode is 401', async () => {
    api.getAccessToken.mockReturnValueOnce('not-valid-token');
    const error = new APIError('Unauthorized', 401);
    api.getOwnProfile.mockRejectedValueOnce(error);

    const result = await thunks.fetchPreloadData({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getAccessToken).toHaveBeenCalled();
    expect(api.getAccessToken.mock.results[0].value).toBe('not-valid-token');
    expect(api.getOwnProfile).toHaveBeenCalledWith({ signal });
    expect(api.removeAccessToken).toHaveBeenCalled();
    expect(result.payload).toBeUndefined();
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should dispatch setAuthUser when token is present and api.getOwnProfile resolves successfully', async () => {
    api.getAccessToken.mockReturnValueOnce('valid-token');
    const fakeUser = {
      id: 'fake-user-id',
      name: 'fake-user-name',
      email: 'fake-user-email',
      avatar: 'fake-user-avatar',
    };
    api.getOwnProfile.mockResolvedValueOnce({ user: fakeUser });

    const result = await thunks.fetchPreloadData({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getAccessToken).toHaveBeenCalled();
    expect(api.getAccessToken.mock.results[0].value).toBe('valid-token');
    expect(api.getOwnProfile).toHaveBeenCalledWith({ signal });
    expect(dispatch).toHaveBeenCalledWith(setAuthUser(fakeUser));
    expect(result.payload).toBeUndefined();
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should return error object when api.getOwnProfile rejects and error.statusCode is not 401', async () => {
    api.getAccessToken.mockReturnValueOnce('some-token');
    const error = new APIError('Internal Server Error', 500);
    api.getOwnProfile.mockRejectedValueOnce(error);

    const result = await thunks.fetchPreloadData({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getAccessToken).toHaveBeenCalled();
    expect(api.getAccessToken.mock.results[0].value).toBe('some-token');
    expect(api.getOwnProfile).toHaveBeenCalledWith({ signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should handle when error.name is AbortError', async () => {
    api.getAccessToken.mockReturnValueOnce('some-token');
    const error = new DOMException('aborted no reason', 'AbortError');
    api.getOwnProfile.mockRejectedValueOnce(error);

    const result = await thunks.fetchPreloadData({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getAccessToken).toHaveBeenCalled();
    expect(api.getAccessToken.mock.results[0].value).toBe('some-token');
    expect(api.getOwnProfile).toHaveBeenCalledWith({ signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: 'Request was aborted',
      statusCode: 408,
    });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });
});