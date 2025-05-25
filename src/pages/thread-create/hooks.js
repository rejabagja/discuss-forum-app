import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useInput, useContentEditable } from '@hooks/index';
import { createThread } from '@states/thunks/threads';
import { toast } from 'react-toastify';


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
      .then((res) => {
        if (isMounted.current) {
          setIsCreateSucceded(true);
          toast.dismiss();
          toast.success(`${res.message} successfully`);
        }
      })
      .catch((error) => {
        if (isMounted.current) {
          if (error.name === 'AbortError') {
            toast.dismiss();
            toast.error(error.message);
            return;
          }
          setError(error.message);
        }
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