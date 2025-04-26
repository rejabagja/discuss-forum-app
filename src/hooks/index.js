import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';


export const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event) => setValue(event.target.value);
  return [value, onChange, setValue];
};

export const useContentEditable = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onInput = (event) => {
    setValue(event.target.innerHTML);
  };
  useEffect(() => {
    if (value === '<br>' || value === '<div><br></div>') {
      setValue('');
    }
  }, [value, setValue]);

  return [value, setValue, onInput];
};

export const useFetchData = (actions) => { // actions: (() => any)[]
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const actionsRef = useRef(actions);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(showLoading());
        for (const action of actionsRef.current) {
          await dispatch(action()).unwrap();
        }
      } catch (error) {
        setError(error);
      } finally {
        dispatch(hideLoading());
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  return { error, isLoading };
};