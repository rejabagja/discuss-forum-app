import AuthForm from './AuthForm';
import { FiMail, FiLock } from 'react-icons/fi';
import { TypeFormLogin } from './types/auth-form-input.type';
import InputIcon from './InputIcon';

const FormLogin = ({
  onSubmitHandler,
  error,
  email,
  onChangeEmail,
  password,
  onChangePassword,
  isLoading,
}) => {
  return (
    <AuthForm onSubmitHandler={onSubmitHandler} error={error}>
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
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="loading loading-spinner loading-xs" />
            <span>Logging in...</span>
          </span>
        ) : (
          'Login'
        )}
      </button>
    </AuthForm>
  );
};

FormLogin.propTypes = TypeFormLogin;

export default FormLogin;
