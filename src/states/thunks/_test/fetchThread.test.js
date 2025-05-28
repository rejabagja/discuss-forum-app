import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../thread_detail';
import api from '@utils/api';
import { APIError } from '@utils';
import { setThreadData } from '@states/slices/thread-detail';
import { hideLoading, showLoading } from 'react-redux-loading-bar';

/*
fetchThread test scenarios:
1. should called fetchThread with right arguments
2. should return result object when api.getThread resolves successfully
3. should return error object when api.getThread rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    getThreadDetail: vi.fn(),
  },
}));

describe('fetchThread thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should called fetchThread with right arguments', async () => {
    const threadId = 'threads-1';
    const fetchThreadSpy = vi.spyOn(thunks, 'fetchThread');
    api.getThreadDetail.mockResolvedValueOnce({ detailThread: {} });

    await thunks.fetchThread({ threadId, signal })(dispatch, getState);
    expect(fetchThreadSpy).toHaveBeenCalledWith({ threadId, signal });

    fetchThreadSpy.mockRestore();
  });

  it('should return result object when api.getThreadDetail resolves successfully', async () => {
    const detailThreadMockResponse = {};
    api.getThreadDetail.mockResolvedValueOnce({ detailThread: detailThreadMockResponse });

    const result = await thunks.fetchThread({ threadId: 'threads-1', signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getThreadDetail).toHaveBeenCalledWith('threads-1', { signal });
    expect(dispatch).toHaveBeenCalledWith(setThreadData(detailThreadMockResponse));
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
    expect(result.payload).toBeUndefined();
  });

  it('should return error object when api.getThreadDetail rejects', async () => {
    const error = new APIError('Internal Server Error', 500);
    api.getThreadDetail.mockRejectedValueOnce(error);

    const result = await thunks.fetchThread({ threadId: 'threads-1', signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getThreadDetail).toHaveBeenCalledWith('threads-1', { signal });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
  });

  it('should handle when error.name is AbortError', async () => {
    const error = new DOMException('aborted no reason', 'AbortError');
    api.getThreadDetail.mockRejectedValueOnce(error);

    const result = await thunks.fetchThread({ threadId: 'threads-1', signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getThreadDetail).toHaveBeenCalledWith('threads-1', { signal });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
    expect(result.payload).toEqual({
      name: error.name,
      message: 'Request was aborted',
      statusCode: 408,
    });
  });
});