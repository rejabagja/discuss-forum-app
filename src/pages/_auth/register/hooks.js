import { useInput } from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import { createUser } from '@states/users';
import { useEffect } from 'react';
import { clearError as clearRegisterError } from '@states/users';


const useRegister = () => {
  const { isLoading, error } = useSelector(({ users }) => users);
  const dispatch = useDispatch();
  const [name, onChangeName] = useInput('');
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');

  const handleRegister = (event) => {
    event.preventDefault();
    dispatch(createUser({ name, email, password }));
  };

  useEffect(() => {
    return () => dispatch(clearRegisterError());
  }, [dispatch]);
  // adding alert when user is registered successfully
  return {
    name,
    onChangeName,
    email,
    onChangeEmail,
    password,
    onChangePassword,
    handleRegister,
    isLoading,
    error,
  };
};

export { useRegister };
