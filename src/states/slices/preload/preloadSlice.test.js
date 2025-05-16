import { describe, it, expect } from 'vitest';
import reducer from './index';
import { preloadProcess } from '@states/thunks';

/*
preloadSlice reducer test scenarios:
1. reducer initial state must be a boolean and equal to true
2. reducer must return the last state when passed an unknown action
3. reducer must return state === true when passed preloadProcess.pending action
4. reducer must return state === false when passed preloadProcess.fulfilled action
5. reducer must return state === false when passed preloadProcess.rejected action
*/
describe('preloadSlice reducer', () => {
  it('should return reducer initial state', () => {
    const nextState = reducer(undefined, { type: '@@INIT' });
    expect(typeof nextState).toBe('boolean');
    expect(nextState).toEqual(true);
  });

  it('should return the last state when passed an unknown action', () => {
    const state1 = reducer(true, { type: 'UNKNOWN_ACTION' });
    expect(state1).toEqual(true);
    const state2 = reducer(false, { type: 'UNKNOWN_ACTION' });
    expect(state2).toEqual(false);
  });

  it('should return state === true when passed preloadProcess.pending action', () => {
    const nextState = reducer(undefined, { type: preloadProcess.pending.type });
    expect(nextState).toEqual(true);
  });

  it('should return state === false when passed preloadProcess.fulfilled action', () => {
    const nextState = reducer(undefined, { type: preloadProcess.fulfilled.type });
    expect(nextState).toEqual(false);
  });

  it('should return state === false when passed preloadProcess.rejected action', () => {
    const nextState = reducer(undefined, { type: preloadProcess.rejected.type });
    expect(nextState).toEqual(false);
  });
});