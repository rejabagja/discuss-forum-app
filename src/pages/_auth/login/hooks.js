import { useEffect, useRef, useState } from 'react';
import { useInput } from '@hooks/index';
import { useDispatch } from 'react-redux';
import { loginUser } from '@states/thunks/auth';
import { toast } from 'react-toastify';


const useLogin = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const isMounted = useRef(false);
  const controller = useRef(null);

  const handleLogin = (event) => {
    event.preventDefault();
    if (controller.current && !controller.current.signal.aborted) {
      controller.current.abort();
    }
    controller.current = new AbortController();

    setError(null);
    setLoading(true);
    const payloads = {
      credentials: { email, password },
      signal: controller.current.signal,
    };
    dispatch(loginUser(payloads))
      .unwrap()
      .then((res) => {
        toast.success(`Welcome back, ${res.user.name}`);
      })
      .catch((error) => {
        if (isMounted.current) setError(error.message);
      })
      .finally(() => {
        if (isMounted.current) setLoading(false);
      });
  };

  useEffect(() => {
    controller.current?.abort();
    isMounted.current = true;

    return () => {
      controller.current?.abort();
      isMounted.current = false;
    };
  }, [dispatch]);

  return {
    email,
    onChangeEmail,
    password,
    onChangePassword,
    handleLogin,
    loading,
    error
  };
};

export { useLogin };