import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUsersThreads } from '@states/combine';
import { useInput, useContentEditable } from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import { addThread, resetCreatedStatus, clearError as clearThreadcreateError } from '@states/threads';


const useThreadCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: threadCreateError, isLoading, isCreated } = useSelector(({ threads }) => threads);
  const [title, onChangeTitle] = useInput('');
  const [body, onInputBody] = useContentEditable('');
  const [category, onChangeCategory] = useInput('');

  const handleCreateThread = () => {
    dispatch(addThread({ title, body, category }));
  };

  useEffect(() => {
    if (isCreated) {
      navigate('/');
      dispatch(resetCreatedStatus());
    }
  }, [navigate, dispatch, isCreated]);

  useEffect(() => {
    dispatch(fetchUsersThreads());
    return () => dispatch(clearThreadcreateError());
  }, [dispatch]);

  return { title, onChangeTitle, onInputBody, category, onChangeCategory, handleCreateThread, threadCreateError, isLoading };
};

export { useThreadCreate };