import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FormRegister from '../FormRegister';
import * as matchers from '@testing-library/jest-dom/matchers';
import { useState } from 'react';

expect.extend(matchers);

/*
FormRegister component test scenarios:
1. should render all form elements
2. should call input handlers when input values change
3. should show error message if error exists
4. should disable submit button when isLoading is true and text button is 'Registering ....'
5. should call input handlers when input values change
6. should prevent form submission when there is empty fields
7. should call onSubmitHandler when form is submitted
*/

describe('FormRegister Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  const createFormWrapper = (customProps = {}) => {
    const onSubmitHandler = vi.fn((e) => e.preventDefault());
    const onChangeName = vi.fn();
    const onChangeEmail = vi.fn();
    const onChangePassword = vi.fn();
    const Wrapper = () => {
      const [name, setName] = useState('');
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');

      return (
        <FormRegister
          name={name}
          onChangeName={onChangeName.mockImplementation((e) =>
            setName(e.target.value)
          )}
          email={email}
          onChangeEmail={onChangeEmail.mockImplementation((e) =>
            setEmail(e.target.value)
          )}
          password={password}
          onChangePassword={onChangePassword.mockImplementation((e) =>
            setPassword(e.target.value)
          )}
          isLoading={false}
          error={null}
          onSubmitHandler={onSubmitHandler}
          {...customProps}
        />
      );
    };

    return {
      onSubmitHandler,
      Wrapper,
      onChangeName,
      onChangeEmail,
      onChangePassword,
    };
  };

  it('should render all form elements', () => {
    const { Wrapper } = createFormWrapper();
    render(<Wrapper />);

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Register' })
    ).toBeInTheDocument();
  });

  it('should show error message if error exists', () => {
    const { Wrapper } = createFormWrapper({ error: 'email already exists' });
    render(<Wrapper />);
    expect(screen.getByText('email already exists')).toBeInTheDocument();
  });

  it('should disable submit button when isLoading is true and text button is "Registering ...."', () => {
    const { Wrapper } = createFormWrapper({ isLoading: true });
    render(<Wrapper />);
    expect(
      screen.getByRole('button', { name: 'Registering ....' })
    ).toBeDisabled();
  });

  it('should prevent form submission when there is empty fields', async () => {
    const user = userEvent.setup();
    const { onSubmitHandler, Wrapper } = createFormWrapper();
    render(<Wrapper />);

    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(onSubmitHandler).not.toHaveBeenCalled();
  });

  it('should call input handlers when input values change', async () => {
    const user = userEvent.setup();
    const { onChangeName, onChangeEmail, onChangePassword, Wrapper } =
      createFormWrapper();
    render(<Wrapper />);
    await user.type(screen.getByPlaceholderText('Name'), 'Test Name');
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'TestPassword');

    expect(onChangeName).toHaveBeenCalled();
    expect(onChangeEmail).toHaveBeenCalled();
    expect(onChangePassword).toHaveBeenCalled();
  });

  it('should call onSubmitHandler when form is submitted', async () => {
    const user = userEvent.setup();
    const { onSubmitHandler, Wrapper } = createFormWrapper();
    render(<Wrapper />);

    await user.type(screen.getByPlaceholderText('Name'), 'Test Name');
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'TestPassword');
    await user.click(screen.getByRole('button', { name: 'Register' }));

    expect(onSubmitHandler).toHaveBeenCalled();
  });
});
