import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useInput } from '@hooks';
import { registerUser } from '@states/thunks/auth';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';


const useRegister = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [name, onChangeName, setName] = useInput('');
  const [email, onChangeEmail, setEmail] = useInput('');
  const [password, onChangePassword, setPassword] = useInput('');
  const controller =  useRef(null);
  const isMounted = useRef(false);

  const handleRegister = (event) => {
    event.preventDefault();
    if (controller.current && !controller.current.signal.aborted) {
      controller.current.abort();
    }
    controller.current = new AbortController();
    setError(null);
    setLoading(true);

    const payloads = {
      payload: { name, email, password },
      signal: controller.current.signal,
    };
    dispatch(registerUser(payloads))
      .unwrap()
      .then((res) => {
        if (isMounted.current) {
          setName('');
          setEmail('');
          setPassword('');
          toast.success(
            React.createElement(
              'div',
              null,
              `${res.message} successfully. `,
              React.createElement(
                Link,
                { to: '/login', className: 'text-blue-500 underline' },
                'Login here'
              )
            )
          );
        }
      })
      .catch((error) => {
        if (isMounted.current) setError(error);
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
    name,
    onChangeName,
    email,
    onChangeEmail,
    password,
    onChangePassword,
    handleRegister,
    loading,
    error
  };
};

export { useRegister };
