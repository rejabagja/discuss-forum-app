import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../index';
import api from '@utils/api';
import { setLeaderboardsData } from '@states/slices/leaderboards';
import { showLoading, hideLoading } from 'react-redux-loading-bar';
import { APIError } from '@utils';

/*
fetchLeaderboards test scenarios:
1. should called fetchLeaderboards with right arguments
2. should dispatch setLeaderboardsData when api.getLeaderBoards resolves successfully
3. should return error object when api.getLeaderBoards rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    getLeaderBoards: vi.fn(),
  },
}));

describe('fetchLeaderboards thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should called fetchLeaderboards with right arguments', async () => {
    const fetchLeaderboardsSpy = vi.spyOn(thunks, 'fetchLeaderboards');
    api.getLeaderBoards.mockResolvedValueOnce({ leaderboards: [] });

    await thunks.fetchLeaderboards({ signal })(dispatch, getState);
    expect(fetchLeaderboardsSpy).toHaveBeenCalledWith({ signal });

    fetchLeaderboardsSpy.mockRestore();
  });

  it('should dispatch setLeaderboardsData when api.getLeaderBoards resolves successfully', async () => {
    api.getLeaderBoards.mockResolvedValueOnce({ leaderboards: [] });

    const result = await thunks.fetchLeaderboards({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getLeaderBoards).toHaveBeenCalledWith({ signal });
    expect(dispatch).toHaveBeenCalledWith(setLeaderboardsData([]));
    expect(result.payload).toBeUndefined();
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should return error object when api.getLeaderBoards rejects', async () => {
    const error = new APIError('Internal Server Error', 500);
    api.getLeaderBoards.mockRejectedValueOnce(error);

    const result = await thunks.fetchLeaderboards({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getLeaderBoards).toHaveBeenCalledWith({ signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });

  it('should handle when error.name is AbortError', async () => {
    const error = new DOMException('aborted no reason', 'AbortError');
    api.getLeaderBoards.mockRejectedValueOnce(error);

    const result = await thunks.fetchLeaderboards({ signal })(dispatch, getState);

    expect(dispatch).toHaveBeenCalledWith(showLoading());
    expect(api.getLeaderBoards).toHaveBeenCalledWith({ signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: 'Request was aborted',
      statusCode: 408,
    });
    expect(dispatch).toHaveBeenCalledWith(hideLoading());
  });
});

