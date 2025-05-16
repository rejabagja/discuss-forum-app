import { describe, it, expect } from 'vitest';
import reducer, { setSelectedCategory, initialState } from './index';
import { fetchThreads } from '@states/thunks';


/*
categories reducer test scenarios:
1. reducer initial state must be an object and equal to { data: [], selectedCategory: null }
2. reducer must return the last state when passed an unknown action
3. reducer must handle setSelectedCategory action with state.selectedCategory === payload
4. reducer must handle fetchThreads.fulfilled action with state.data === payload
*/

describe('categoriesSlice reducer', () => {
  it('should return reducer initial state', () => {
    const nextState = reducer(undefined, { type: '@@INIT' });
    expect(typeof nextState).toBe('object');
    expect(nextState).toEqual(initialState);
  });

  it('should return the last state when passed an unknown action', () => {
    const nextState = reducer(initialState, { type: 'UNKNOWN_ACTION' });
    expect(nextState).toEqual(initialState);
  });

  it('should return state.selectedCategory === payload when handle setSelectedCategory action', () => {
    const nextState = reducer(initialState, setSelectedCategory('test-category'));
    expect(nextState.selectedCategory).toBe('test-category');
  });

  it('should return state.data === payload when handle fetchThreads.fulfilled action', () => {
    const threads = [
      {
        id: 'thread-1',
        title: 'Thread Pertama',
        body: 'Ini adalah thread pertama',
        category: 'General',
        createdAt: '2021-06-21T07:00:00.000Z',
        ownerId: 'users-1',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
      {
        id: 'thread-2',
        title: 'Thread Kedua',
        body: 'Ini adalah thread kedua',
        category: 'General',
        createdAt: '2021-06-21T07:00:00.000Z',
        ownerId: 'users-2',
        upVotesBy: [],
        downVotesBy: [],
        totalComments: 0,
      },
    ];
    const categories = [...new Set(threads.map((thread) => thread.category))];
    const nextState = reducer(initialState, {
      type: fetchThreads.fulfilled.type,
      payload: threads,
    });
    expect(nextState.data).toStrictEqual(categories);
  });
});