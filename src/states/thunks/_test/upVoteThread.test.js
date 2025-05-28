import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../threads';
import api from '@utils/api';
import { APIError } from '@utils';
import { voteUpThread, threadVotesRollback } from '@states/slices/threads';
import { VoteType } from '@constants';

/*
upVoteThread test scenarios:
1. should called upVoteThread with right arguments
2. should return result object when api.upVoteThread resolves successfully
3. should return error object when api.upVoteThread rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    setVoteThread: vi.fn(),
  },
}));

describe('upVoteThread thunk', () => {
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
        threads: {
          data: [
            {
              id: 'threads-1',
              upVotesBy: [],
              downVotesBy: [],
            },
            {
              id: 'threads-2',
              upVotesBy: [],
              downVotesBy: [],
            },
          ],
        },
      };
    });
  });

  it('should called upVoteThread with right arguments', async () => {
    const upVoteThreadSpy = vi.spyOn(thunks, 'upVoteThread');
    api.setVoteThread.mockResolvedValueOnce({ vote: {}, message: 'ok' });

    await thunks.upVoteThread({ threadId: 'threads-1', signal })(dispatch, getState);
    expect(upVoteThreadSpy).toHaveBeenCalledWith({ threadId: 'threads-1', signal });

    upVoteThreadSpy.mockRestore();
  });

  it('should return result object when api.upVoteThread resolves successfully', async () => {
    const threadId = 'threads-1';
    const userId = 'users-1';
    const voteMockResponse = {
      id: 'votes-1',
      userId: 'users-1',
      threadId: 'threads-1',
      voteType: 1,
    };
    api.setVoteThread.mockResolvedValueOnce({ vote: voteMockResponse, message: 'ok' });

    const result = await thunks.upVoteThread({ threadId, signal })(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpThread({ threadId, userId }));
    expect(api.setVoteThread).toHaveBeenCalledWith(threadId, VoteType.UP_VOTE, { signal });
    expect(result.payload).toBeUndefined();
  });

  it('should return error object when api.upVoteThread rejects', async () => {
    const threadId = 'threads-2';
    const userId = 'users-1';
    const error = new APIError('Internal Server Error', 500);
    api.setVoteThread.mockRejectedValueOnce(error);

    const result = await thunks.upVoteThread({ threadId, signal })(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpThread({ threadId, userId }));
    expect(api.setVoteThread).toHaveBeenCalledWith(threadId, VoteType.UP_VOTE, { signal });
    expect(dispatch).toHaveBeenCalledWith(threadVotesRollback({ threadId, upVotesBy: [], downVotesBy: [] }));
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

    const result = await thunks.upVoteThread({ threadId, signal })(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpThread({ threadId, userId }));
    expect(api.setVoteThread).toHaveBeenCalledWith(threadId, VoteType.UP_VOTE, { signal });
    expect(dispatch).toHaveBeenCalledWith(threadVotesRollback({ threadId, upVotesBy: [], downVotesBy: [] }));
    expect(result.payload).toEqual({
      name: error.name,
      message: 'upvote thread was aborted',
    });
  });
});