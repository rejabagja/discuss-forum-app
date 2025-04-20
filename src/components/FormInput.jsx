import { TypeFormInput } from './types/auth-form-input.type';

const FormInput = ({ label, type = 'text', icon, value, changeHandler }) => {
  return (
    <label className="input input-bordered flex items-center gap-2">
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

FormInput.propTypes = TypeFormInput;

export default FormInput;
