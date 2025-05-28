import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../auth';
import api from '@utils/api';
import { APIError } from '@utils';

/*
registerUser test scenarios:
1. should called registerUser with right arguments
2. should return result object when api.registerUser resolves successfully
3. should return error object when api.registerUser rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    register: vi.fn(),
  },
}));

describe('registerUser thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should called registerUser with right arguments', async () => {
    const registerUserSpy = vi.spyOn(thunks, 'registerUser');
    api.register.mockResolvedValueOnce({ user: {}, message: '' });

    await thunks.registerUser({ payload: {}, signal })(dispatch, getState);
    expect(registerUserSpy).toHaveBeenCalledWith({ payload: {}, signal });

    registerUserSpy.mockRestore();
  });

  it('should return result object when api.registerUser resolves successfully', async () => {
    api.register.mockResolvedValueOnce({ user: {}, message: '' });

    const result = await thunks.registerUser({ payload: {}, signal })(dispatch, getState);

    expect(api.register).toHaveBeenCalledWith({}, { signal });
    expect(result.payload).toEqual({ user: {}, message: '' });
  });

  it('should return error object when api.registerUser rejects', async () => {
    const error = new APIError('email already exists', 400);
    const fakePayload = { email: 'email', password: 'password', username: 'username' };
    api.register.mockRejectedValueOnce(error);

    const result = await thunks.registerUser({ payload: fakePayload, signal })(dispatch, getState);

    expect(api.register).toHaveBeenCalledWith(fakePayload, { signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
    });
  });

  it('should handle when error.name is AbortError', async () => {
    const error = new DOMException('aborted no reason', 'AbortError');
    api.register.mockRejectedValueOnce(error);

    const result = await thunks.registerUser({ payload: {}, signal })(dispatch, getState);

    expect(api.register).toHaveBeenCalledWith({}, { signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: 'Registration request was aborted. Please try again.',
    });
  });
});