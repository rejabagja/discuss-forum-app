import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchThreadCreateData } from '@states/thunks';
import { useInput, useContentEditable } from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import { addThread, resetCreatedStatus, clearError as clearThreadcreateError } from '@states/threads';


const useThreadCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error: threadCreateError, isLoading, isCreated } = useSelector(({ threads }) => threads);
  const [title, onChangeTitle] = useInput('');
  const [category, onChangeCategory] = useInput('');
  const [body, , onInputBody] = useContentEditable('');

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
    dispatch(fetchThreadCreateData());
    return () => dispatch(clearThreadcreateError());
  }, [dispatch]);

  return { title, onChangeTitle, body, onInputBody, category, onChangeCategory, handleCreateThread, threadCreateError, isLoading };
};

export { useThreadCreate };