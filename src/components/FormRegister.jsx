import AuthForm from './AuthForm';
import InputIcon from './InputIcon';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { TypeFormRegister } from './types/auth-form-input.type';

const FormRegister = ({
  onSubmitHandler,
  error,
  name,
  onChangeName,
  email,
  onChangeEmail,
  password,
  onChangePassword,
  isLoading,
}) => {
  return (
    <AuthForm onSubmitHandler={onSubmitHandler} error={error}>
      <InputIcon
        label="Name"
        icon={<FiUser />}
        value={name}
        changeHandler={onChangeName}
      />
      <InputIcon
        label="Email"
        type="email"
        value={email}
        changeHandler={onChangeEmail}
        icon={<FiMail />}
      />
      <InputIcon
        label="Password"
        type="password"
        value={password}
        changeHandler={onChangePassword}
        icon={<FiLock />}
      />
      <button
        type="submit"
        className="btn btn-accent w-full"
        disabled={isLoading}
      >
        {isLoading && (
          <span className="loading loading-spinner loading-xs"></span>
        )}
        {isLoading ? 'Registering ....' : 'Register'}
      </button>
    </AuthForm>
  );
};

FormRegister.propTypes = TypeFormRegister;

export default FormRegister;
