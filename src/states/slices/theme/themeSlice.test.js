/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import reducer, { toggleTheme, getInitialTheme } from './index';

/*
themeSlice reducer test scenarios:
1. reducer initial state must be a string and equal to 'light'
2. reducer must return state === localStorage.getItem('theme') when there is key 'theme' in localStorage
3. reducer must return state to 'light' when toggleTheme action is called and previous state is 'dark'
4. reducer must return state to 'dark' when toggleTheme action is called and previous state is 'light'
5. reducer must return the last state when passed an unknown action

getInitialTheme function test scenarios:
1. should return string type
2. should return 'light' when there is no key 'theme' in localStorage
3. should return 'dark' when key 'theme' in localStorage is 'dark'
4. should return 'light' when key 'theme' in localStorage is 'light'
5. should return 'light' when key 'theme' in localStorage is not 'dark' or 'light'
6. should return 'light' or 'dark' when key 'theme' in localStorage is 'dark' or 'light'
*/

describe('themeSlice reducer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return reducer initial state', () => {
    const nextState = reducer(undefined, { type: '@@INIT' });
    expect(typeof nextState).toBe('string');
    expect(nextState).toEqual('light');
  });

  it('should return state === localStorage.getItem("theme") when there is key "theme" in localStorage', async () => {
    localStorage.setItem('theme', 'dark');
    vi.resetModules();
    const { default: reducer } = await import('./index');
    const nextState = reducer(undefined, { type: '@@INIT' });
    expect(nextState).toEqual('dark');
  });

  it('should return state to "dark" when passed toggleTheme action and previous state is "light"', () => {
    const nextState = reducer('light', toggleTheme);
    expect(nextState).toEqual('dark');
  });

  it('should return state to "light" when passed toggleTheme action and previous state is "dark"', () => {
    const nextState = reducer('dark', toggleTheme);
    expect(nextState).toEqual('light');
  });

  it('should return the last state when passed an unknown action', () => {
    const state1 = reducer('light', { type: 'UNKNOWN_ACTION' });
    expect(state1).toEqual('light');
    const state2 = reducer('dark', { type: 'UNKNOWN_ACTION' });
    expect(state2).toEqual('dark');
  });
});

describe('getInitialTheme function', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return string type', () => {
    expect(typeof getInitialTheme()).toBe('string');
  });

  it('should return state === localStorage.getItem("theme") when there is key "theme" in localStorage', () => {
    localStorage.setItem('theme', 'dark');
    expect(getInitialTheme()).toEqual('dark');
  });

  it('should return state to "light" when there is no key "theme" in localStorage', () => {
    expect(getInitialTheme()).toEqual('light');
  });

  it('should return state to "dark" when localStorage.getItem("theme") is "dark"', () => {
    localStorage.setItem('theme', 'dark');
    expect(getInitialTheme()).toEqual('dark');
  });

  it('should return state to "light" when localStorage.getItem("theme") is "light"', () => {
    localStorage.setItem('theme', 'light');
    expect(getInitialTheme()).toEqual('light');
  });

  it('should return state to "light" when localStorage.getItem("theme") is not "dark" or "light"', () => {
    localStorage.setItem('theme', 'test');
    expect(getInitialTheme()).toEqual('light');
  });
});
