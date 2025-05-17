import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInput } from '@hooks';
import { ErrorType } from '@constants';
import { createUser } from '@states/thunks/users';
import { clearError as clearRegisterError } from '@states/slices/users';


const useRegister = () => {
  const { isLoading: registerLoading, error } = useSelector(({ users }) => users);
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

  return {
    name,
    onChangeName,
    email,
    onChangeEmail,
    password,
    onChangePassword,
    handleRegister,
    registerLoading,
    error,
    ErrorType
  };
};

export { useRegister };
