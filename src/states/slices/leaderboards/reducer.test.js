import { describe, it, expect } from 'vitest';
import reducer, { setLeaderboardsData } from './index';


/*
leaderboards reducer test scenarios:
1. should return initial state when dispatched an unknown action
2. should set leaderboards data when dispatched setLeaderboardsData action
*/

describe('leaderboards reducer function', () => {
  const initialState = { data: [] };
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

  it('should return initial state when dispatched an unknown action', () => {
    const action = { type: 'unknown' };
    const nextState = reducer(undefined, action);
    expect(nextState).toEqual(initialState);
  });

  it('should set leaderboards data when dispatched setLeaderboardsData action', () => {
    const nextState = reducer(undefined, setLeaderboardsData(leaderboards));
    expect(nextState).toEqual({ data: leaderboards });
  });
});