import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchData } from '@hooks';
import { ErrorType } from '@constants';
import { useInput, useContentEditable } from '@hooks/index';
import { fetchThreads, addThread } from '@states/thunks/threads';
import { resetCreateStatus, clearError as clearThreadCreateError } from '@states/slices/threads';


const useThreadCreate = () => {
  const { error: fetchDataError, isLoading: fetchDataLoading } = useFetchData([fetchThreads]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, onChangeTitle] = useInput('');
  const [category, onChangeCategory] = useInput('');
  const [body, , onInputBody] = useContentEditable('');
  const { error: threadCreateError, isLoading: createLoading, createStatus } = useSelector(({ threads }) => threads);

  const handleCreateThread = () => {
    dispatch(addThread({ title, body, category }));
  };

  useEffect(() => {
    if (createStatus) {
      navigate('/');
      dispatch(resetCreateStatus());
    }
  }, [navigate, dispatch, createStatus]);

  useEffect(() => {
    document.title = 'Create Thread - Discuss Forum App';
    return () => {
      document.title = 'Discuss Forum App';
      dispatch(clearThreadCreateError());
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