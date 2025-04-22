import { useState, useRef } from 'react';
import { TypeEditableContent } from './types/auth-form-input.type';

const EditableContent = ({
  placeholder = 'Write your content here...',
  onInput,
}) => {
  const [isEmpty, setIsEmpty] = useState(true);
  const divRef = useRef(null);

  const handleInput = (event) => {
    const text = divRef.current?.innerText.trim();
    setIsEmpty(text === '');
    onInput(event);
  };

  return (
    <div className="relative w-full">
      {isEmpty && (
        <span className="absolute inset-4 text-slate-400 pointer-events-none text-sm">
          {placeholder}
        </span>
      )}
      <div
        ref={divRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-28 max-h-[450px] overflow-y-auto p-4 border-[1px] rounded-lg text-sm appearance-none bg-base-100 outline-none focus:outline-2 focus:outline-accent input-bordered"
        role="textbox"
        aria-label="input"
      ></div>
    </div>
  );
};

EditableContent.propTypes = TypeEditableContent;

export default EditableContent;
