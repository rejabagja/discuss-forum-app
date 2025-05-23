import { useRegister } from './hooks';
import { FormRegister } from '@components';
import AuthPageWrapper from '@layouts/AuthPageWrapper';

const PageRegister = () => {
  const {
    name,
    onChangeName,
    email,
    onChangeEmail,
    password,
    onChangePassword,
    handleRegister,
    loading,
    error,
  } = useRegister();
  return (
    <AuthPageWrapper
      title="Create Your Account"
      subtitle="Fill in your details to join the conversation."
      linkAction="login"
    >
      <FormRegister
        onSubmitHandler={handleRegister}
        error={error}
        name={name}
        onChangeName={onChangeName}
        email={email}
        onChangeEmail={onChangeEmail}
        password={password}
        onChangePassword={onChangePassword}
        isLoading={loading}
      />
    </AuthPageWrapper>
  );
};

export default PageRegister;
