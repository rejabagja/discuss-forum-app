import { TypeInput } from './types/auth-form-input.type';

const Input = ({
  label,
  type = 'text',
  value,
  changeHandler,
  className = '',
}) => {
  return (
    <input
      value={value}
      onChange={changeHandler}
      type={type}
      placeholder={label}
      className={`input-bordered w-full border-[1px] text-sm appearance-none outline-none ${className}`}
    />
  );
};

Input.propTypes = TypeInput;

export default Input;
