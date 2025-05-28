import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as thunks from '../thread_detail';
import api from '@utils/api';
import { APIError } from '@utils';
import { addNewComment } from '@states/slices/thread-detail';

/*
createComment test scenarios:
1. should called createComment with right arguments
2. should dispatch addNewComment when api.createComment resolves successfully
3. should return error object when api.createComment rejects
4. should handle when error.name is AbortError
*/

vi.mock('@utils/api', () => ({
  default: {
    createComment: vi.fn(),
  },
}));

describe('createComment thunk', () => {
  const dispatch = vi.fn();
  const getState = vi.fn();
  const signal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should called createComment with right arguments', async () => {
    const createCommentSpy = vi.spyOn(thunks, 'createComment');
    api.createComment.mockResolvedValueOnce({ comment: {}, message: '' });

    await thunks.createComment({ payload: {}, signal })(dispatch, getState);
    expect(createCommentSpy).toHaveBeenCalledWith({ payload: {}, signal });

    createCommentSpy.mockRestore();
  });

  it('should dispatch addNewComment when api.createComment resolves successfully', async () => {
    api.createComment.mockResolvedValueOnce({ comment: {}, message: '' });

    const result = await thunks.createComment({ payload: {}, signal })(dispatch, getState);

    expect(api.createComment).toHaveBeenCalledWith({}, { signal });
    expect(dispatch).toHaveBeenCalledWith(addNewComment({}));
    expect(result.payload).toEqual({ message: '' });
  });

  it('should return error object when api.createComment rejects', async () => {
    const error = new APIError('Internal Server Error', 500);
    api.createComment.mockRejectedValueOnce(error);

    const result = await thunks.createComment({ payload: {}, signal })(dispatch, getState);

    expect(api.createComment).toHaveBeenCalledWith({}, { signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: error.message,
    });
  });

  it('should handle when error.name is AbortError', async () => {
    const error = new DOMException('aborted no reason', 'AbortError');
    api.createComment.mockRejectedValueOnce(error);

    const result = await thunks.createComment({ payload: {}, signal })(dispatch, getState);

    expect(api.createComment).toHaveBeenCalledWith({}, { signal });
    expect(result.payload).toEqual({
      name: error.name,
      message: 'Create comment was aborted',
    });
  });
});
