import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../thread_detail';
import api from '@utils/api';
import { APIError } from '@utils';
import { voteUpThread, threadVotesRollback } from '@states/slices/thread-detail';
import { VoteType } from '@constants';

/*
upVoteThreadDetail test scenarios:
1. should called upVoteThreadDetail with right arguments
2. should return result object when api.upVoteThreadDetail resolves successfully
3. should return error object when api.upVoteThreadDetail rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    setVoteThread: vi.fn(),
  },
}));

describe('upVoteThreadDetail thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;
  beforeEach(() => {
    vi.clearAllMocks();
    getState.mockImplementation(() => {
      return {
        auth: {
          user: {
            id: 'users-1',
            name: 'name-test',
          },
        },
        threadDetail: {
          data: {
            id: 'threads-1',
            upVotesBy: [],
            downVotesBy: [],
          },
        },
      };
    });
  });

  it('should called upVoteThreadDetail with right arguments', async () => {
    const upVoteThreadDetailSpy = vi.spyOn(thunks, 'upVoteThreadDetail');
    api.setVoteThread.mockResolvedValueOnce({ vote: {}, message: 'ok' });

    await thunks.upVoteThreadDetail({ threadId: 'threads-1', signal })(dispatch, getState);
    expect(upVoteThreadDetailSpy).toHaveBeenCalledWith({ threadId: 'threads-1', signal });

    upVoteThreadDetailSpy.mockRestore();
  });

  it('should return result object when api.upVoteThreadDetail resolves successfully', async () => {
    const threadId = 'threads-1';
    const userId = 'users-1';
    api.setVoteThread.mockResolvedValueOnce({ vote: {}, message: 'ok' });

    const result = await thunks.upVoteThreadDetail({ threadId, signal })(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpThread(userId));
    expect(api.setVoteThread).toHaveBeenCalledWith(threadId, VoteType.UP_VOTE, { signal });
    expect(result.payload).toBeUndefined();
  });

  it('should return error object when api.upVoteThreadDetail rejects', async () => {
    const threadId = 'threads-1';
    const userId = 'users-1';
    const error = new APIError('Internal Server Error', 500);
    api.setVoteThread.mockRejectedValueOnce(error);

    const result = await thunks.upVoteThreadDetail({ threadId, signal })(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpThread(userId));
    expect(api.setVoteThread).toHaveBeenCalledWith(threadId, VoteType.UP_VOTE, { signal });
    expect(dispatch).toHaveBeenCalledWith(threadVotesRollback({ upVotesBy: [], downVotesBy: [] }));
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
    });
  });

  it('should handle when error.name is AbortError', async () => {
    const threadId = 'threads-1';
    const userId = 'users-1';
    const error = new DOMException('aborted no reason', 'AbortError');
    api.setVoteThread.mockRejectedValueOnce(error);

    const result = await thunks.upVoteThreadDetail({ threadId, signal })(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpThread(userId));
    expect(api.setVoteThread).toHaveBeenCalledWith(threadId, VoteType.UP_VOTE, { signal });
    expect(dispatch).toHaveBeenCalledWith(threadVotesRollback({ upVotesBy: [], downVotesBy: [] }));
    expect(result.payload).toEqual({
      name: error.name,
      message: 'upvote thread was aborted',
    });
  });
});