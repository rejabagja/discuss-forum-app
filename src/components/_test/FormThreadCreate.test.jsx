import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormThreadCreate from '../FormThreadCreate';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers);

/*
FormThreadCreate component test scenarios:
1. should render all form elements
2. should call input handlers when input values change
3. should show error message if error exists
4. should disable submit button when isLoading is true and text button is 'Creating...'
5. should call handleCreateThread when form is submitted
*/

describe('FormThreadCreate Component', () => {
  let props;

  beforeEach(() => {
    vi.clearAllMocks();
    props = {
      title: '',
      onChangeTitle: vi.fn(),
      body: '',
      onInputBody: vi.fn(),
      category: '',
      onChangeCategory: vi.fn(),
      isLoading: false,
      error: null,
      handleCreateThread: vi.fn(),
    };
  });

  afterEach(() => {
    cleanup();
  });

  it('should render all form elements', () => {
    render(<FormThreadCreate {...props} />);
    expect(screen.getByPlaceholderText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Category')).toBeInTheDocument();
    const textEditableContent = screen.getByText(
      'Write your thread body here...'
    );
    expect(textEditableContent).toBeInTheDocument();
    expect(textEditableContent.nextSibling).toHaveAttribute(
      'contenteditable',
      'true'
    );
    expect(screen.getByRole('button', { name: /Create/i })).toBeInTheDocument();
  });

  it('should call input handlers when input values change', async () => {
    const user = userEvent.setup();
    render(<FormThreadCreate {...props} />);

    const titleInput = screen.getByPlaceholderText('Title');
    await user.type(titleInput, 'Test Title');
    expect(props.onChangeTitle).toHaveBeenCalled();

    const categoryInput = screen.getByPlaceholderText('Category');
    await user.type(categoryInput, 'Test Category');
    expect(props.onChangeCategory).toHaveBeenCalled();

    const bodyInput = screen.getByText(
      'Write your thread body here...'
    ).nextSibling;
    await user.type(bodyInput, 'Test Body');
    expect(props.onInputBody).toHaveBeenCalled();
  });

  it('should show error message if error exists', () => {
    render(<FormThreadCreate {...props} error={'"title" cannot be empty'} />);
    expect(screen.getByText('"title" cannot be empty')).toBeInTheDocument();
  });

  it('should disable submit button when isLoading is true and text button is "Creating..."', () => {
    render(<FormThreadCreate {...props} isLoading={true} />);
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled();
  });

  it('should call handleCreateThread when form is submitted', async () => {
    const user = userEvent.setup();
    render(<FormThreadCreate {...props} />);
    await user.click(screen.getByRole('button', { name: /Create/i }));
    expect(props.handleCreateThread).toHaveBeenCalled();
  });
});
