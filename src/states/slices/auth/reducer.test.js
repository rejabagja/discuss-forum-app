import { describe, it, expect } from 'vitest';
import reducer, { setAuthUser, clearAuthUser } from './index';


/*
auth reducer test scenarios:
1. should return initial state when dispatched an unknown action
2. should set auth user when dispatched setAuthUser action
3. should clear auth user when dispatched clearAuthUser action
*/

describe('auth reducer function', () => {
  const initialState = { user: null };
  const user = {
    id: 'test-id',
    name: 'test-name',
    email: 'test-email@example.com',
    avatar: 'https://example.com/avatar.jpg',
  };

  it('should return initial state when dispatched an unknown action', () => {
    const action = { type: 'unknown' };
    const nextState = reducer(undefined, action);
    expect(nextState).toEqual(initialState);
  });

  it('should set auth user when dispatched setAuthUser action', () => {
    const nextState = reducer(undefined, setAuthUser(user));
    expect(nextState).toEqual({ user });
  });

  it('should clear auth user when dispatched clearAuthUser action', () => {
    const nextState = reducer({ user }, clearAuthUser());
    expect(nextState).toEqual({ user: null });
  });
});