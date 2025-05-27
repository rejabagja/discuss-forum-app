import { describe, it, expect } from 'vitest';
import reducer, { setUsersData } from './index';

/*
users reducer test scenarios:
1. should return initial state when dispatched an unknown action
2. should set users data when dispatched setUsersData action
*/

describe('users reducer function', () => {
  const initialState = { data: [] };
  const users = [
    {
      id: 'john_doe',
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://generated-image-url.jpg',
    },
    {
      id: 'jane_doe',
      name: 'Jane Doe',
      email: 'jane@example.com',
      avatar: 'https://generated-image-url.jpg',
    },
    {
      id: 'fulan',
      name: 'Si Fulan',
      email: 'fulan@example.com',
      avatar: 'https://generated-image-url.jpg',
    },
  ];

  it('should return initial state when dispatched an unknown action', () => {
    const action = { type: 'unknown' };
    const nextState = reducer(undefined, action);
    expect(nextState).toEqual(initialState);
  });

  it('should set users data when dispatched setUsersData action', () => {
    const nextState = reducer(undefined, setUsersData(users));
    expect(nextState).toEqual({ data: users });
  });
});