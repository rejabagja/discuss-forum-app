import { beforeEach, describe, expect, it } from 'vitest';
import reducer,
{
  setThreadData,
  voteUpThread,
  voteDownThread,
  voteNeutralThread,
  voteUpComment,
  voteDownComment,
  voteNeutralComment,
  addNewComment,
  threadVotesRollback,
  commentVotesRollback
}
  from './index';

/*
threadDetail reducer test scenarios:
1. should return initial state when dispatched an unknown action
2. should set thread data when dispatched setThreadData action
3. should vote up thread when dispatched voteUpThread action
4. should vote down thread when dispatched voteDownThread action
5. should vote neutral thread when dispatched voteNeutralThread action
6. should add new comment when dispatched addNewComment action
7. should vote up comment when dispatched voteUpComment action
8. should vote down comment when dispatched voteDownComment action
9. should vote neutral comment when dispatched voteNeutralComment action
10. should rollback thread votes when dispatched threadVotesRollback action
11. should rollback comment votes when dispatched commentVotesRollback action
*/
describe('threadDetail reducer function', () => {
  const initialState = { data: null };
  const threadDetail = {
    id: 'thread-1',
    title: 'Thread Pertama',
    body: 'Ini adalah thread pertama',
    category: 'General',
    createdAt: '2021-06-21T07:00:00.000Z',
    owner: {
      id: 'users-1',
      name: 'John Doe',
      avatar: 'https://generated-image-url.jpg',
    },
    upVotesBy: [],
    downVotesBy: [],
    comments: [
      {
        id: 'comment-1',
        content: 'Ini adalah komentar pertama',
        createdAt: '2021-06-21T07:00:00.000Z',
        owner: {
          id: 'users-1',
          name: 'John Doe',
          avatar: 'https://generated-image-url.jpg',
        },
        upVotesBy: [],
        downVotesBy: [],
      },
    ],
  };
  let currentState;

  beforeEach(() => {
    currentState = {
      data: { ...threadDetail },
    };
  });

  it('should return initial state when dispatched an unknown action', () => {
    const action = { type: 'unknown' };
    const nextState = reducer(undefined, action);
    expect(nextState).toEqual(initialState);
  });

  it('should set thread data when dispatched setThreadData action', () => {
    const nextState = reducer(undefined, setThreadData(threadDetail));
    expect(nextState).toEqual({ data: threadDetail });
  });

  it('should vote up thread when dispatched voteUpThread action', () => {
    const userId = 'users-test-1';

    // if userId is aleady in upVotesBy array
    currentState = { data: { ...threadDetail, upVotesBy: ['users-test-1'] } };
    const nextState = reducer(currentState, voteUpThread(userId));
    expect(nextState).toEqual(currentState);

    // if userId is aleady in downVotesBy array
    currentState = { data: { ...threadDetail, downVotesBy: ['users-test-1'] } };
    const nextState2 = reducer(currentState, voteUpThread(userId));
    expect(nextState2.data.upVotesBy.includes(userId)).toEqual(true);
    expect(nextState2.data.downVotesBy.includes(userId)).toEqual(false);

    // if userId is not in votes
    currentState = { data: { ...threadDetail } };
    const nextState3 = reducer(currentState, voteUpThread(userId));
    expect(nextState3.data.upVotesBy.includes(userId)).toEqual(true);
    expect(nextState3.data.downVotesBy.includes(userId)).toEqual(false);
  });

  it('should vote down thread when dispatched voteDownThread action', () => {
    const userId = 'users-test-1';

    // if userId is aleady in downVotesBy array
    currentState = { data: { ...threadDetail, downVotesBy: ['users-test-1'] } };
    const nextState = reducer(currentState, voteDownThread(userId));
    expect(nextState).toEqual(currentState);

    // if userId is aleady in upVotesBy array
    currentState = { data: { ...threadDetail, upVotesBy: ['users-test-1'] } };
    const nextState2 = reducer(currentState, voteDownThread(userId));
    expect(nextState2.data.upVotesBy.includes(userId)).toEqual(false);
    expect(nextState2.data.downVotesBy.includes(userId)).toEqual(true);

    // if userId is not in votes
    currentState = { data: { ...threadDetail } };
    const nextState3 = reducer(currentState, voteDownThread(userId));
    expect(nextState3.data.upVotesBy.includes(userId)).toEqual(false);
    expect(nextState3.data.downVotesBy.includes(userId)).toEqual(true);
  });

  it('should vote neutral thread when dispatched voteNeutralThread action', () => {
    const userId = 'users-test-1';

    // if userId is not in votes
    const nextState = reducer(currentState, voteNeutralThread(userId));
    expect(nextState).toEqual(currentState);

    // if userId is in votes
    currentState = { data: { ...threadDetail, upVotesBy: ['users-test-1'], downVotesBy: ['users-test-2'] } };
    const nextState2 = reducer(currentState, voteNeutralThread(userId));
    expect(nextState2.data.upVotesBy.includes(userId)).toEqual(false);
    expect(nextState2.data.downVotesBy.includes(userId)).toEqual(false);

    currentState = { data: { ...threadDetail, upVotesBy: ['users-test-10'], downVotesBy: ['users-test-1'] } };
    const nextState3 = reducer(currentState, voteNeutralThread(userId));
    expect(nextState3.data.upVotesBy.includes(userId)).toEqual(false);
    expect(nextState3.data.downVotesBy.includes(userId)).toEqual(false);
  });

  it('should rollback votes when dispatched threadVotesRollback action', () => {
    const votes = { upVotesBy: ['users-test-1'], downVotesBy: ['users-test-2'] };
    const nextState = reducer(currentState, threadVotesRollback(votes));
    expect(nextState.data.upVotesBy).toEqual(votes.upVotesBy);
    expect(nextState.data.downVotesBy).toEqual(votes.downVotesBy);
  });

  it('should vote up comment when dispatched voteUpComment action', () => {
    const userId = 'users-test-1';
    let commentId;

    // if commentId is not in comments
    commentId = 'comments-test-1';
    const nextState = reducer(currentState, voteUpComment({ commentId, userId }));
    expect(nextState.data.comments).toEqual(currentState.data.comments);

    // if userId is aleady in upVotesBy array
    commentId = 'comment-1';
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0], upVotesBy: ['users-test-1'] }
        ]
      }
    };
    const nextState2 = reducer(currentState, voteUpComment({ commentId, userId }));
    expect(nextState2.data.comments[0].upVotesBy.includes(userId)).toEqual(true);
    expect(nextState2.data.comments[0].downVotesBy.includes(userId)).toEqual(false);

    // if userId is not in votes
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0] }
        ]
      }
    };
    const nextState3 = reducer(currentState, voteUpComment({ commentId, userId }));
    expect(nextState3.data.comments[0].upVotesBy.includes(userId)).toEqual(true);
    expect(nextState3.data.comments[0].downVotesBy.includes(userId)).toEqual(false);

    // if userId is in downVotesBy array
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0], downVotesBy: ['users-test-1'] }
        ]
      }
    };
    const nextState4 = reducer(currentState, voteUpComment({ commentId, userId }));
    expect(nextState4.data.comments[0].upVotesBy.includes(userId)).toEqual(true);
    expect(nextState4.data.comments[0].downVotesBy.includes(userId)).toEqual(false);
  });

  it('should vote down comment when dispatched voteDownComment action', () => {
    const userId = 'users-test-1';
    let commentId;

    // if commentId is not in comments
    commentId = 'comments-test-1';
    const nextState = reducer(currentState, voteDownComment({ commentId, userId }));
    expect(nextState.data.comments).toEqual(currentState.data.comments);

    // if userId is aleady in downVotesBy array
    commentId = 'comment-1';
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0], downVotesBy: ['users-test-1'] }
        ]
      }
    };
    const nextState2 = reducer(currentState, voteDownComment({ commentId, userId }));
    expect(nextState2.data.comments[0].upVotesBy.includes(userId)).toEqual(false);
    expect(nextState2.data.comments[0].downVotesBy.includes(userId)).toEqual(true);

    // if userId is not in votes
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0] }
        ]
      }
    };
    const nextState3 = reducer(currentState, voteDownComment({ commentId, userId }));
    expect(nextState3.data.comments[0].upVotesBy.includes(userId)).toEqual(false);
    expect(nextState3.data.comments[0].downVotesBy.includes(userId)).toEqual(true);

    // if userId is in upVotesBy array
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0], upVotesBy: ['users-test-1'] }
        ]
      }
    };
    const nextState4 = reducer(currentState, voteDownComment({ commentId, userId }));
    expect(nextState4.data.comments[0].upVotesBy.includes(userId)).toEqual(false);
    expect(nextState4.data.comments[0].downVotesBy.includes(userId)).toEqual(true);
  });

  it('should neutral vote comment when dispatched voteNeutralComment action', () => {
    const userId = 'users-test-1';
    let commentId;

    // if commentId is not in comments
    commentId = 'comments-test-1';
    const nextState = reducer(currentState, voteNeutralComment({ commentId, userId }));
    expect(nextState.data.comments).toEqual(currentState.data.comments);

    // if userId is not in votes
    commentId = 'comment-1';
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0] }
        ]
      }
    };
    const nextState2 = reducer(currentState, voteNeutralComment({ commentId, userId }));
    expect(nextState2.data.comments).toEqual(currentState.data.comments);

    // if userId is in upVotesBy array
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0], upVotesBy: ['users-test-1'] }
        ]
      }
    };
    const nextState3 = reducer(currentState, voteNeutralComment({ commentId, userId }));
    expect(nextState3.data.comments[0].upVotesBy.includes(userId)).toEqual(false);
    expect(nextState3.data.comments[0].downVotesBy.includes(userId)).toEqual(false);

    // if userId is in downVotesBy array
    currentState = {
      data: {
        ...threadDetail,
        comments: [
          { ...threadDetail.comments[0], downVotesBy: ['users-test-1'] }
        ]
      }
    };
    const nextState4 = reducer(currentState, voteNeutralComment({ commentId, userId }));
    expect(nextState4.data.comments[0].upVotesBy.includes(userId)).toEqual(false);
    expect(nextState4.data.comments[0].downVotesBy.includes(userId)).toEqual(false);
  });

  it('should rollback vote comment when dispatched commentVotesRollback action', () => {
    const votes = { upVotesBy: ['users-test-1'], downVotesBy: ['users-test-2'] };
    const payload = { ...votes };

    // if commentId is not in comments
    payload.commentId = 'comments-test-1';
    const nextState = reducer(currentState, commentVotesRollback(payload));
    expect(nextState).toEqual(currentState);

    // if commentId is in comments
    payload.commentId = 'comment-1';
    const nextState2 = reducer(currentState, commentVotesRollback(payload));
    expect(nextState2.data.comments[0].upVotesBy).toEqual(votes.upVotesBy);
    expect(nextState2.data.comments[0].downVotesBy).toEqual(votes.downVotesBy);
  });

  it('should add new comment when dispatched addNewComment action', () => {
    const newComment = { ...threadDetail.comments[0], id: 'comments-test-1' };
    const nextState = reducer(currentState, addNewComment(newComment));
    expect(nextState.data.comments.length).toEqual(currentState.data.comments.length + 1);
    expect(nextState.data.comments[0].id).toEqual(newComment.id);
  });
});