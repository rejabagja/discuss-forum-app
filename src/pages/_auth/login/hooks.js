import { useInput } from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@states/auth-user';
import { useEffect } from 'react';
import { clearError as clearLoginError } from '@states/auth-user';


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
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    return () => dispatch(clearLoginError());
  }, [dispatch]);

  return { email, onChangeEmail, password, onChangePassword, handleLogin, isLoading, error };
};

export { useLogin };