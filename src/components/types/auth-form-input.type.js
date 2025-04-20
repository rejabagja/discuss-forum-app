import PropTypes from 'prop-types';

const FormShape = {
  onSubmitHandler: PropTypes.func.isRequired,
  error: PropTypes.string,
  isLoading: PropTypes.bool.isRequired
};

const LoginInputShape = {
  email: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  onChangeEmail: PropTypes.func.isRequired,
  onChangePassword: PropTypes.func.isRequired,
};

export const TypeAuthForm = {
  children: PropTypes.node.isRequired,
  onSubmitHandler: FormShape.onSubmitHandler,
  error: FormShape.error,
};

export const TypeFormLogin = {
  ...FormShape,
  ...LoginInputShape,
};

export const TypeFormRegister = {
  ...FormShape,
  ...LoginInputShape,
  name: PropTypes.string.isRequired,
  onChangeName: PropTypes.func.isRequired
};

export const TypeFormInput = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  icon: PropTypes.node,
  value: PropTypes.string.isRequired,
  changeHandler: PropTypes.func.isRequired
};