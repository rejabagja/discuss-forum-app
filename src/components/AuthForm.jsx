import { TypeAuthForm } from './types/auth-form-input.type';

const AuthForm = ({ children, onSubmitHandler, error }) => {
  return (
    <form
      method="post"
      className="flex flex-col gap-3"
      onSubmit={onSubmitHandler}
    >
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {children}
    </form>
  );
};

AuthForm.propTypes = TypeAuthForm;

export default AuthForm;
