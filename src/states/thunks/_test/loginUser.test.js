import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../auth';
import api from '@utils/api';
import { APIError } from '@utils';
import { setAuthUser } from '@states/slices/auth';

/*
loginUser test scenarios:
1. should called loginUser with right arguments
2. should dispatch setAuthUser when loginUser resolves successfully
3. should return error object when loginUser rejects
4. should return error object when loginUser rejects and error.name is AbortError
5. should return error object when api.getOwnProfile rejects
*/

vi.mock('@utils/api', () => ({
  default: {
    login: vi.fn(),
    getOwnProfile: vi.fn(),
    setAccessToken: vi.fn(),
    getAccessToken: vi.fn(),
    removeAccessToken: vi.fn(),
  },
}));

describe('loginUser thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should called loginUser with right arguments', async () => {
    const loginUserSpy = vi.spyOn(thunks, 'loginUser');
    api.login.mockResolvedValueOnce({ token: 'token' });
    api.getOwnProfile.mockResolvedValueOnce({ user: {} });

    await thunks.loginUser({ credentials: {}, signal })(dispatch, getState);
    expect(loginUserSpy).toHaveBeenCalledWith({ credentials: {}, signal });

    loginUserSpy.mockRestore();
  });

  it('should dispatch setAuthUser when loginUser resolves successfully', async () => {
    const token = 'token';
    const user = {
      id: 'fake-user-id',
      name: 'fake-user-name',
      email: 'fake-user-email',
      avatar: 'fake-user-avatar',
    };
    const credentials = { email: 'email', password: 'password' };
    api.login.mockResolvedValueOnce({ token });
    api.setAccessToken.mockImplementation((token) => token);
    api.getOwnProfile.mockResolvedValueOnce({ user });

    const result = await thunks.loginUser({ credentials, signal })(
      dispatch,
      getState
    );

    expect(api.login).toHaveBeenCalledWith(credentials, { signal });
    expect(api.setAccessToken).toHaveBeenCalledWith(token);
    expect(api.getOwnProfile).toHaveBeenCalledWith({ signal });
    expect(dispatch).toHaveBeenCalledWith(setAuthUser(user));
    expect(result.payload).toEqual({ user, message: 'Login successful' });
  });

  it('should return error object when loginUser rejects', async () => {
    const error = new APIError('email or password is incorrect', 400);
    const fakeCredentials = { email: 'email', password: 'password' };
    api.login.mockRejectedValueOnce(error);

    const result = await thunks.loginUser({
      credentials: fakeCredentials,
      signal,
    })(dispatch, getState);

    expect(api.login).toHaveBeenCalledWith(fakeCredentials, { signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
    });
  });

  it('should handle when error.name is AbortError and loginUser rejects', async () => {
    const error = new DOMException('aborted no reason', 'AbortError');
    const credentials = { email: 'email', password: 'password' };
    api.login.mockRejectedValueOnce(error);

    const result = await thunks.loginUser({ credentials, signal })(dispatch, getState);

    expect(api.login).toHaveBeenCalledWith(credentials, { signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: 'Login request was aborted. Please try again.',
    });
  });

  it('should return error object when api.getOwnProfile rejects', async () => {
    const error = new APIError('Internal Server Error', 500);
    api.login.mockResolvedValueOnce({ token: 'token' });
    api.getOwnProfile.mockRejectedValueOnce(error);
    api.getAccessToken.mockReturnValueOnce('token');

    const result = await thunks.loginUser({ credentials: {}, signal })(dispatch, getState);

    expect(api.getOwnProfile).toHaveBeenCalledWith({ signal });
    expect(api.getAccessToken).toHaveBeenCalled();
    expect(api.removeAccessToken).toHaveBeenCalled();
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
    });
  });
});