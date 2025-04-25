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