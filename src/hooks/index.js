import { useState, useEffect } from 'react';


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

export const useOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const onOnline = () => setIsOnline(true);
  const onOffline = () => setIsOnline(false);

  useEffect(() => {
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  return isOnline;
};