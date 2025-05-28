import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CategoryItem from '../CategoryItem';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

/*
CategoryItem component test scenarios:
1. should render category name text based on category prop
2. should call toggleFilter function when clicked
3. should apply "bg-secondary text-secondary-content" class when isSelected is true
*/

describe('CategoryItem Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render category name text based on category prop', () => {
    const category = 'Category A';
    const selectedCategory = 'Category B';
    render(
      <CategoryItem
        category={category}
        selectedCategory={selectedCategory}
        toggleFilter={vi.fn()}
      />
    );
    expect(screen.getByText(/Category A/)).toBeInTheDocument();
    expect(screen.getByText(/Category A/)).not.toHaveClass(
      'bg-secondary text-secondary-content'
    );
  });

  it('should call toggleFilter function when clicked', async () => {
    const user = userEvent.setup();
    const category = 'Category A';
    const selectedCategory = 'Category B';
    const toggleFilter = vi.fn((category) => category);
    render(
      <CategoryItem
        category={category}
        selectedCategory={selectedCategory}
        toggleFilter={toggleFilter}
      />
    );
    await user.click(screen.getByRole('button'));
    expect(toggleFilter).toHaveBeenCalledWith(category);
  });

  it('should apply "bg-secondary text-secondary-content" class when isSelected is true', () => {
    const category = 'Category A';
    const selectedCategory = 'Category A';
    render(
      <CategoryItem
        category={category}
        selectedCategory={selectedCategory}
        toggleFilter={vi.fn()}
      />
    );
    expect(screen.getByText(/Category A/)).toHaveClass(
      'bg-secondary text-secondary-content'
    );
  });
});
