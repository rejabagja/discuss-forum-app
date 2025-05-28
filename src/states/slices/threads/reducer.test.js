import { describe, it, expect, beforeEach } from 'vitest';
import reducer,
{
  setThreadsData,
  voteUpThread,
  voteDownThread,
  voteNeutralThread,
  threadVotesRollback
} from './index';


/*
threads reducer test scenarios:
1. should return initial state when dispatched an unknown action
2. should set threads data when dispatched setThreadsData action
3. should vote up thread when dispatched voteUpThread action
4. should vote down thread when dispatched voteDownThread action
5. should vote neutral thread when dispatched voteNeutralThread action
6. should rollback thread votes when dispatched threadVotesRollback action
*/

describe('threads reducer function', () => {
  let currentState;
  const initialState = { data: [] };
  const threads = [
    {
      id: 'thread-1',
      title: 'Discussion on AI Ethics',
      body: "Let's delve into the ethical implications of artificial intelligence and its impact on society. What are your thoughts on responsible AI development?",
      category: 'Technology',
      createdAt: '2024-05-26T10:30:00.000Z',
      ownerId: 'user-alpha',
      upVotesBy: ['user-beta', 'user-gamma'],
      downVotesBy: [],
      totalComments: 5,
    },
    {
      id: 'thread-2',
      title: 'Best Hiking Trails in Bandung',
      body: 'Looking for recommendations for scenic hiking trails around Bandung. Any hidden gems or must-try routes?',
      category: 'Travel',
      createdAt: '2024-05-25T14:15:00.000Z',
      ownerId: 'user-beta',
      upVotesBy: ['user-alpha'],
      downVotesBy: ['user-delta'],
      totalComments: 8,
    },
  ];

  beforeEach(() => {
    currentState = {
      data: [...threads],
    };
  });

  it('should return initial state when dispatched an unknown action', () => {
    const action = { type: 'unknown' };
    const nextState = reducer(undefined, action);
    expect(nextState).toEqual(initialState);
  });

  it('should set threads data when dispatched setThreadsData action', () => {
    const nextState = reducer(undefined, setThreadsData(threads));
    expect(nextState).toEqual({ data: threads });
  });

  it('should vote up thread when dispatched voteUpThread action', () => {
    const threadId = 'thread-1';
    const userId = 'user-test-1';
    // if userId is not in votes
    const state1 = reducer(currentState, voteUpThread({ threadId, userId }));
    const thread = state1.data.find((thread) => thread.id === threadId);
    expect(thread.upVotesBy.includes(userId)).toEqual(true);

    // if userId is already in upVotesBy array
    const state2 = reducer(state1, voteUpThread({ threadId, userId }));
    expect(state2.data).toEqual(state1.data);

    // if userId is in downVotesBy array
    const userInDownVotesState = {
      data: [
        {
          id: 'thread-1',
          upVotesBy: ['user-beta', 'user-gamma'],
          downVotesBy: ['user-test-1'],
        },
      ]
    };
    const state3 = reducer(userInDownVotesState, voteUpThread({ threadId, userId }));
    const thread2 = state3.data.find((thread) => thread.id === threadId);
    expect(thread2.upVotesBy.includes(userId)).toEqual(true);
    expect(thread2.downVotesBy.includes(userId)).toEqual(false);

    // if threadId is not found
    const state4 = reducer(currentState, voteUpThread({ threadId: 'thread-3', userId }));
    expect(state4).toEqual(currentState);
  });

  it('should vote down thread when dispatched voteDownThread action', () => {
    const threadId = 'thread-2';
    const userId = 'user-test-2';
    // if userId is not in votes
    const state1 = reducer(currentState, voteDownThread({ threadId, userId }));
    const thread = state1.data.find((thread) => thread.id === threadId);
    expect(thread.downVotesBy.includes(userId)).toEqual(true);

    // if userId is already in downVotesBy array
    const state2 = reducer(state1, voteDownThread({ threadId, userId }));
    expect(state2.data).toEqual(state1.data);

    // if userId is in upVotesBy array
    const userInUpVotesState = {
      data: [
        {
          id: 'thread-2',
          upVotesBy: ['user-alpha', 'user-test-2'],
          downVotesBy: ['user-delta'],
          totalComments: 8,
        },
      ],
    };
    const state3 = reducer(userInUpVotesState, voteDownThread({ threadId, userId }));
    const thread2 = state3.data.find((thread) => thread.id === threadId);
    expect(thread2.downVotesBy.includes(userId)).toEqual(true);
    expect(thread2.upVotesBy.includes(userId)).toEqual(false);

    // if threadId is not found
    const state4 = reducer(currentState, voteDownThread({ threadId: 'thread-X', userId }));
    expect(state4).toEqual(currentState);
  });

  it('should vote neutral thread when dispatched voteNeutralThread action', () => {
    // if threadId is not found
    let threadId = 'thread-3';
    let userId = 'user-beta';
    const nextState = reducer(currentState, voteNeutralThread({ threadId, userId }));
    expect(nextState).toEqual(currentState);

    // if userId is not in votes
    threadId = 'thread-1';
    userId = 'user-test-1';
    const state1 = reducer(currentState, voteNeutralThread({ threadId, userId }));
    expect(state1).toEqual(currentState);

    // if userId is in votes
    threadId = 'thread-10';
    userId = 'user-test-13';
    const inVotesState = {
      data: [
        {
          id: 'thread-10',
          upVotesBy: ['user-beta', 'user-gamma'],
          downVotesBy: ['user-test-13'],
        },
      ]
    };
    const state2 = reducer(inVotesState, voteNeutralThread({ threadId, userId }));
    const thread = state2.data.find((thread) => thread.id === threadId);
    expect(thread.upVotesBy.includes(userId)).toEqual(false);
    expect(thread.downVotesBy.includes(userId)).toEqual(false);
  });

  it('should rollback thread votes when dispatched threadVotesRollback action', () => {
    // if threadId is not found
    let threadId = 'thread-99';
    const payload = {
      threadId,
      upVotesBy: ['user-alpha', 'user-beta', 'user-gamma'],
      downVotesBy: ['user-delta', 'user-epsilon', 'user-zeta'],
    };
    const nextState = reducer(currentState, threadVotesRollback(payload));
    expect(nextState).toEqual(currentState);

    // if threadId is found
    threadId = 'thread-1';
    payload.threadId = threadId;
    const state1 = reducer(currentState, threadVotesRollback(payload));
    const thread = state1.data.find((thread) => thread.id === threadId);
    expect(thread.upVotesBy).toEqual(payload.upVotesBy);
    expect(thread.downVotesBy).toEqual(payload.downVotesBy);
  });
});