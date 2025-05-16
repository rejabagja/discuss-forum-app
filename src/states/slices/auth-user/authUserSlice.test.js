import { describe, it, expect, beforeEach } from 'vitest';
import { login, preloadProcess } from '@states/thunks';
import reducer, { setAuthUser, clearAuthUser, clearError, initialState } from './index';

/*
authUser reducer test scenarios:
1. reducer initial state must be an object and equal to { data: null, isLoading: false, error: null }
2. reducer must return the last state when passed an unknown action
3. reducer must handle setAuthUser action with state.data === payload
4. reducer must handle clearAuthUser action with state,data === null
5. reducer must handle clearError action with state.error === null
6. reducer must handle login.pending action with state.isLoading === true and state.error === null
7. reducer must handle login.fulfilled action with state.isLoading === false and state.data === payload
8. reducer must handle login.rejected action with state.isLoading === false and state.error === payload
9. reducer must handle preloadProcess.fulfilled action with state.data === payload
*/


describe('authUserSlice reducer', () => {
  let user, prevState;

  beforeEach(() => {
    user = {
      id: 'test-user-id',
      name: 'Sample User',
      email: 'test-user@mail.com',
      avatar: 'https://example.com/avatar.jpg',
    };
    prevState = {
      data: user,
      isLoading: false,
      error: null,
    };
  });

  it('should return reducer initial state', () => {
    const nextState = reducer(undefined, { type: '@@INIT' });
    expect(typeof nextState).toBe('object');
    expect(nextState).toEqual(initialState);
  });

  it('should return the last state when passed an unknown action', () => {
    const nextState = reducer(prevState, { type: 'UNKNOWN_ACTION' });
    expect(nextState).toEqual(prevState);
  });

  it('should return state.data === payload when handle setAuthUser action', () => {
    const nextState = reducer(initialState, setAuthUser(user));
    expect(nextState.data).toEqual(user);
  });

  it('should return state.data === null when handle clearAuthUser action', () => {
    const nextState = reducer(prevState, clearAuthUser());
    expect(nextState.data).toEqual(null);
  });

  it('should return state.error === null when handle clearError action', () => {
    const error = {
      type: 'AUTH-ERROR',
      message: 'something went wrong',
      name: 'AppError',
      statusCode: 500,
    };
    const errorState = { ...initialState, error };
    const nextState = reducer(errorState, clearError());
    expect(nextState.error).toBe(null);
  });

  it('should handle login.pending action', () => {
    const nextState = reducer(initialState, { type: login.pending.type });
    expect(nextState.isLoading).toBe(true);
    expect(nextState.error).toBe(null);
  });

  it('should handle login.fulfilled action', () => {
    const nextState = reducer(initialState, {
      type: login.fulfilled.type,
      payload: user,
    });
    expect(nextState.isLoading).toBe(false);
    expect(nextState.data).toEqual(user);
  });

  it('should handle login.rejected action', () => {
    const error = {
      type: 'LOGIN',
      message: 'email or password is incorrect',
      name: 'AppError',
      statusCode: 401,
    };
    const nextState = reducer(initialState, {
      type: login.rejected.type,
      payload: error,
    });
    expect(nextState.isLoading).toBe(false);
    expect(nextState.error).toEqual(error);
  });

  it('should handle preloadProcess.fulfilled action', () => {
    const nextState = reducer(initialState, {
      type: preloadProcess.fulfilled.type,
      payload: user,
    });
    expect(nextState.data).toEqual(user);
  });
});