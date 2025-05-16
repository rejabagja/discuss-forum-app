import { describe, it, expect } from 'vitest';
import reducer, { initialState } from './index';
import { fetchLeaderboards } from '@states/thunks';

/*
leaderboardsSlice reducer test scenarios:
1. reducer must return initialState and state = { data: [], error: null }
2. reducer must return state.error === null when passed fetchLeaderboards.pending action
3. reducer must return state.data === payload when passed fetchLeaderboards.fulfilled action
4. reducer must return state.error === payload when passed fetchLeaderboards.rejected action
5. reducer must return last state when passed an unknown action
*/

describe('leaderboardsSlice reducer', () => {
  it('should return initialState and state = { data: [], error: null }', () => {
    const nextState = reducer(undefined, { type: '@@INIT' });
    expect(typeof nextState).toBe('object');
    expect(nextState).toEqual(initialState);
  });

  it('should return state.error === null when passed fetchLeaderboards.pending action', () => {
    const nextState = reducer(initialState, { type: fetchLeaderboards.pending.type });
    expect(nextState.error).toBe(null);
  });

  it('should return state.data === payload when passed fetchLeaderboards.fulfilled action', () => {
    const leaderboards = [
      {
        user: {
          id: 'users-1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://generated-image-url.jpg',
        },
        score: 10,
      },
      {
        user: {
          id: 'users-2',
          name: 'Jane Doe',
          email: 'jane@example.com',
          avatar: 'https://generated-image-url.jpg',
        },
        score: 5,
      },
    ];
    const nextState = reducer(initialState, { type: fetchLeaderboards.fulfilled.type, payload: leaderboards });
    expect(nextState.data).toEqual(leaderboards);
  });

  it('should return state.error === payload when passed fetchLeaderboards.rejected action', () => {
    const error = {
      type: 'FETCH_DATA',
      message: 'Failed to fetch leaderboards',
      name: 'AppError',
      statusCode: 500,
    };
    const nextState = reducer(initialState, { type: fetchLeaderboards.rejected.type, payload: error });
    expect(nextState.error).toEqual(error);
  });

  it('should return last state when passed an unknown action', () => {
    const nextState = reducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(nextState).toEqual(initialState);
  });
});