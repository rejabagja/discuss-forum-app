import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchThreads } from '@states/threads';
import { useFetchData } from '@hooks';
import { useInput, useContentEditable } from '@hooks/index';
import { useDispatch, useSelector } from 'react-redux';
import { ErrorType } from '@constants';
import { addThread, resetCreatedStatus, clearError as clearThreadcreateError } from '@states/threads';


const useThreadCreate = () => {
  const { error: fetchDataError, isLoading: fetchDataLoading } = useFetchData([fetchThreads]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, onChangeTitle] = useInput('');
  const [category, onChangeCategory] = useInput('');
  const [body, , onInputBody] = useContentEditable('');
  const { error: threadCreateError, isLoading: createLoading, isCreated } = useSelector(({ threads }) => threads);

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
    document.title = 'Create Thread - Discuss Forum App';
    return () => {
      document.title = 'Discuss Forum App';
      dispatch(clearThreadcreateError());
    };
  }, [dispatch]);

  return {
    title, onChangeTitle,
    body, onInputBody,
    category, onChangeCategory,
    handleCreateThread, threadCreateError,
    createLoading, fetchDataError, fetchDataLoading,
    ErrorType
  };
};

export { useThreadCreate };