import { useEffect, useRef, useState } from 'react';
import { TypeEditableContent } from './types/auth-form-input.type';

const EditableContent = ({
  value,
  onInput,
  placeholder = 'Write your content here...',
  className = '',
}) => {
  const [isEmpty, setIsEmpty] = useState(!value);
  const ref = useRef(null);
  const handleInput = (event) => {
    onInput(event);
    setIsEmpty(
      (event.target.innerText || '').trim() === '' &&
        (event.target.innerHTML || '').trim() === ''
    );
  };

  useEffect(() => {
    if (value === '') {
      ref.current.innerHTML = value;
      setIsEmpty(true);
    }
  }, [value]);

  return (
    <div className="relative w-full">
      {isEmpty && (
        <span className="absolute inset-4 text-slate-400 pointer-events-none text-sm">
          {placeholder}
        </span>
      )}
      <div
        ref={ref}
        contentEditable
        onInput={handleInput}
        className={`w-full min-h-28 p-4 border-[1px] rounded-lg text-sm appearance-none bg-base-100 outline-none focus:outline-2 focus:outline-accent input-bordered ${className}`}
        role="textbox"
        aria-label="input content"
      ></div>
    </div>
  );
};

EditableContent.propTypes = TypeEditableContent;

export default EditableContent;
