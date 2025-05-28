import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../threads';
import api from '@utils/api';
import { APIError } from '@utils';

/*
createThread test scenarios:
1. should called createThread with right arguments
2. should return result object when api.createThread resolves successfully
3. should return error object when api.createThread rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    createThread: vi.fn(),
  },
}));

describe('createThread thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should called createThread with right arguments', async () => {
    const createThreadSpy = vi.spyOn(thunks, 'createThread');
    api.createThread.mockResolvedValueOnce({ thread: {} });

    await thunks.createThread({ payload: {}, signal })(dispatch, getState);
    expect(createThreadSpy).toHaveBeenCalledWith({ payload: {}, signal });

    createThreadSpy.mockRestore();
  });

  it('should return result object when api.createThread resolves successfully', async () => {
    api.createThread.mockResolvedValueOnce({ message: 'ok' });

    const result = await thunks.createThread({ payload: {}, signal })(dispatch, getState);

    expect(api.createThread).toHaveBeenCalledWith({}, { signal });
    expect(result.payload).toEqual({ message: 'ok' });
  });

  it('should return error object when api.createThread rejects', async () => {
    const error = new APIError('Internal Server Error', 500);
    api.createThread.mockRejectedValueOnce(error);

    const result = await thunks.createThread({ payload: {}, signal })(dispatch, getState);

    expect(api.createThread).toHaveBeenCalledWith({}, { signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
    });
  });

  it('should handle when error.name is AbortError', async () => {
    const error = new DOMException('aborted no reason', 'AbortError');
    api.createThread.mockRejectedValueOnce(error);

    const result = await thunks.createThread({ payload: {}, signal })(dispatch, getState);

    expect(api.createThread).toHaveBeenCalledWith({}, { signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: 'Create thread was aborted',
    });
  });
});