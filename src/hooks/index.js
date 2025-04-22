import { useState } from 'react';

const useInput = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onChange = (event) => setValue(event.target.value);
  return [value, onChange, setValue];
};

const useContentEditable = (initialValue) => {
  const [value, setValue] = useState(initialValue);
  const onInput = (event) => {
    setValue(event.target.innerHTML);
  };
  return [value, onInput, setValue];
};

export { useInput, useContentEditable };