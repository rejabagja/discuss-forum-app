import { useEffect } from 'react';
import { useInput } from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '@states/thunks';
import { clearError as clearLoginError } from '@states/slices/auth-user';


const useLogin = () => {
  const {
    isLoading,
    error,
  } = useSelector(({ authUser }) => authUser);
  const dispatch = useDispatch();
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const handleLogin = (event) => {
    event.preventDefault();
    dispatch(login({ email, password }));
  };

  useEffect(() => {
    return () => dispatch(clearLoginError());
  }, [dispatch]);

  return { email, onChangeEmail, password, onChangePassword, handleLogin, isLoading, error };
};

export { useLogin };