import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../thread_detail';
import api from '@utils/api';
import { APIError } from '@utils';
import {
  voteUpComment,
  commentVotesRollback,
} from '@states/slices/thread-detail';
import { VoteType } from '@constants';

/*
upVoteComment test scenarios:
1. should called upVoteComment with right arguments
2. should return result object when api.upVoteComment resolves successfully
3. should return error object and dispatch commentVotesRollback when api.upVoteComment rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    setVoteComment: vi.fn(),
  },
}));

describe('upVoteComment thunk', () => {
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
            comments: [
              {
                id: 'comments-1',
                upVotesBy: [],
                downVotesBy: [],
              },
            ]
          },
        },
      };
    });
  });

  it('should called upVoteComment with right arguments', async () => {
    const upVoteCommentSpy = vi.spyOn(thunks, 'upVoteComment');
    api.setVoteComment.mockResolvedValueOnce({ vote: {}, message: 'ok' });

    await thunks.upVoteComment({ commentId: 'comments-1', threadId: 'threads-1', signal })(dispatch, getState);
    expect(upVoteCommentSpy).toHaveBeenCalledWith({
      commentId: 'comments-1',
      threadId: 'threads-1',
      signal,
    });

    upVoteCommentSpy.mockRestore();
  });

  it('should dispatch voteUpComment when api.setVoteComment resolves successfully', async () => {
    const commentId = 'comments-1';
    const userId = 'users-1';
    const threadId = 'threads-1';
    const payload = { commentId, threadId, signal };
    api.setVoteComment.mockResolvedValueOnce({ vote: {}, message: 'ok' });

    const result = await thunks.upVoteComment(payload)(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpComment({ commentId, userId }));
    expect(api.setVoteComment).toHaveBeenCalledWith({ commentId, threadId, voteType: VoteType.UP_VOTE }, { signal });
    expect(result.payload).toBeUndefined();
  });

  it('should dispatch commentVotesRollback and return error object when api.setVoteComment rejects', async () => {
    const commentId = 'comments-1';
    const threadId = 'threads-1';
    const userId = 'users-1';
    const upVotesBy = [];
    const downVotesBy = [];
    const error = new APIError('Internal Server Error', 500);
    api.setVoteComment.mockRejectedValueOnce(error);

    const result = await thunks.upVoteComment({ commentId, threadId, signal })(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpComment({ commentId, userId }));
    expect(api.setVoteComment).toHaveBeenCalledWith({ commentId, threadId, voteType: VoteType.UP_VOTE }, { signal });
    expect(dispatch).toHaveBeenCalledWith(commentVotesRollback({ commentId, upVotesBy, downVotesBy }));
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
    });
  });

  it('should handle when error.name is AbortError', async () => {
    const commentId = 'comments-1';
    const threadId = 'threads-1';
    const userId = 'users-1';
    const error = new DOMException('aborted no reason', 'AbortError');
    api.setVoteComment.mockRejectedValueOnce(error);

    const result = await thunks.upVoteComment({ commentId, threadId, signal })(dispatch, getState);

    expect(getState).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith(voteUpComment({ commentId, userId }));
    expect(api.setVoteComment).toHaveBeenCalledWith({ commentId, threadId, voteType: VoteType.UP_VOTE }, { signal });
    expect(dispatch).toHaveBeenCalledWith(commentVotesRollback({ commentId, upVotesBy: [], downVotesBy: [] }));
    expect(result.payload).toEqual({
      name: error.name,
      message: 'upvote comment was aborted',
    });
  });
});
