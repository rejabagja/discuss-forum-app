import { useLogin } from './hooks';
import FormLogin from '@components/FormLogin';
import AuthPageWrapper from '@layouts/AuthPageWrapper';

const PageLogin = () => {
  const {
    email,
    onChangeEmail,
    password,
    onChangePassword,
    handleLogin,
    loading,
    error,
  } = useLogin();

  return (
    <AuthPageWrapper
      title="Log Into Your Account"
      subtitle="Access the forum and join the discussion."
      linkAction="register"
    >
      <FormLogin
        onSubmitHandler={handleLogin}
        error={error}
        email={email}
        onChangeEmail={onChangeEmail}
        password={password}
        onChangePassword={onChangePassword}
        isLoading={loading}
      />
    </AuthPageWrapper>
  );
};

export default PageLogin;
