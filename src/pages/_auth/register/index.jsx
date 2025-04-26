import { useRegister } from './hooks';
import FormRegister from '@components/FormRegister';
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
    registerLoading,
    error,
    ErrorType,
  } = useRegister();
  return (
    <AuthPageWrapper
      title="Create Your Account"
      subtitle="Fill in your details to join the conversation."
      linkAction="login"
    >
      <FormRegister
        onSubmitHandler={handleRegister}
        error={error?.type === ErrorType.CREATE_USER ? error.message : null}
        name={name}
        onChangeName={onChangeName}
        email={email}
        onChangeEmail={onChangeEmail}
        password={password}
        onChangePassword={onChangePassword}
        isLoading={registerLoading}
      />
    </AuthPageWrapper>
  );
};

export default PageRegister;
