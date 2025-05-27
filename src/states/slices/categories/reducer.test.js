import { describe, it, expect } from 'vitest';
import reducer, { setSelectedCategory, setCategoriesData } from './index';


/*
categories reducer test scenarios:
1. should return initial state when dispatched an unknown action
2. should set selected category when dispatched setSelectedCategory action
3. should set categories data when dispatched setCategoriesData action
*/

describe('categories reducer function', () => {
  const initialState = { data: [], selectedCategory: null };
  const categories = ['general', 'redux', 'react'];

  it('should return initial state when dispatched an unknown action', () => {
    const action = { type: 'unknown' };
    const nextState = reducer(undefined, action);
    expect(nextState).toEqual(initialState);
  });

  it('should set categories data when dispatched setCategoriesData action', () => {
    const nextState = reducer(undefined, setCategoriesData(categories));
    expect(nextState).toEqual({ ...initialState, data: categories });
  });

  it('should set selected category when dispatched setSelectedCategory action', () => {
    const currentState = {
      data: [...categories],
      selectedCategory: null,
    };
    const nextState = reducer(currentState, setSelectedCategory('react'));
    expect(nextState).toEqual({ ...currentState, selectedCategory: 'react' });
  });
});