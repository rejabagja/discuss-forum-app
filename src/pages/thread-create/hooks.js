import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useInput, useContentEditable } from '@hooks/index';
import { createThread } from '@states/thunks/threads';


const useThreadCreate = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCreateSucceded, setIsCreateSucceded] = useState(false);
  const [title, onChangeTitle] = useInput('');
  const [category, onChangeCategory] = useInput('');
  const [body, , onInputBody] = useContentEditable('');
  const controller = useRef(null);
  const isMounted = useRef(false);

  const handleCreateThread = () => {
    controller.current?.abort();
    controller.current = new AbortController();

    const payloads = {
      payload: { title, body, category },
      signal: controller.current.signal,
    };
    setError(null);
    setLoading(true);
    dispatch(createThread(payloads))
      .unwrap()
      .then(() => {
        if (isMounted.current) {
          setIsCreateSucceded(true);
        }
      })
      .catch((error) => {
        if (isMounted.current && error.name !== 'AbortError') setError(error.message);
      })
      .finally(() => {
        if (isMounted.current) setLoading(false);
      });
  };

  useEffect(() => {
    document.title = 'Create Thread - Discuss Forum App';
    controller.current?.abort();
    isMounted.current = true;

    return () => {
      document.title = 'Discuss Forum App';
      controller.current?.abort();
      isMounted.current = false;
    };
  }, [dispatch]);

  return {
    title, onChangeTitle,
    body, onInputBody,
    category, onChangeCategory,
    handleCreateThread, error,
    loading, isCreateSucceded,
  };
};

export { useThreadCreate };