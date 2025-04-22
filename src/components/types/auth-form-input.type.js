import PropTypes from 'prop-types';
import { classNameType } from './index';

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

const InputShape = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string,
  changeHandler: PropTypes.func,
  className: classNameType
};

export const TypeInputIcon = {
  ...InputShape,
  icon: PropTypes.node,
};

export const TypeInput = {
  ...InputShape,
};

export const TypeEditableContent = {
  placeholder: PropTypes.string,
  onInput: PropTypes.func
};

export const TypeFormThreadCreate = {
  title: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  onChangeTitle: PropTypes.func.isRequired,
  onInputBody: PropTypes.func.isRequired,
  onChangeCategory: PropTypes.func.isRequired,
  handleCreateThread: PropTypes.func.isRequired,
  error: FormShape.error,
  isLoading: FormShape.isLoading
};