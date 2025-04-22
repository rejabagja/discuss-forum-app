import { TypeInputIcon } from './types/auth-form-input.type';

const InputIcon = ({
  label,
  type = 'text',
  icon,
  value,
  changeHandler,
  className,
}) => {
  return (
    <label
      className={`input input-bordered flex items-center gap-2 ${className}`}
    >
      {icon}
      <input
        type={type}
        className="grow"
        placeholder={label}
        value={value}
        onChange={changeHandler}
        required
      />
    </label>
  );
};

InputIcon.propTypes = TypeInputIcon;

export default InputIcon;
