import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import reducer, { toggleTheme } from './index';
import * as utils from '@utils';
/*
theme reducer test scenarios:
1. should return initial state when dispatched an unknown action
2. should return initial state light theme from getInitialTheme
3. should return initial state dark theme from getInitialTheme
4. should toggle from light to dark
5. should toggle from dark to light
*/

describe('theme reducer function', () => {
  let getInitialThemeSpy;
  beforeEach(() => {
    // spy and mock getInitialTheme
    getInitialThemeSpy = vi.spyOn(utils, 'getInitialTheme').mockReturnValue('light');
  });

  afterEach(() => {
    // restore getInitialTheme
    getInitialThemeSpy.mockRestore();
  });

  it('should return initial state when dispatched an unknown action', () => {
    const action = { type: 'unknown' };
    const nextState = reducer(undefined, action);
    expect(nextState).toBe('light');
    expect(getInitialThemeSpy).toHaveBeenCalledTimes(1);
  });

  it('should initialize with light theme from getInitialTheme', () => {
    const state1 = reducer(undefined, { type: undefined });
    expect(state1).toBe('light');
    expect(getInitialThemeSpy).toHaveBeenCalledTimes(1);
  });

  it('should initialize with dark theme from getInitialTheme', () => {
    getInitialThemeSpy.mockReturnValue('dark');
    const state2 = reducer(undefined, { type: undefined });
    expect(state2).toBe('dark');
    expect(getInitialThemeSpy).toHaveBeenCalledTimes(1);
  });

  it('should toggle from light to dark', () => {
    const state = reducer('light', toggleTheme());
    expect(state).toBe('dark');
  });

  it('should toggle from dark to light', () => {
    const state = reducer('dark', toggleTheme());
    expect(state).toBe('light');
  });
});