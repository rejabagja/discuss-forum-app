import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

const GuestOnly = ({ redirectTo = '/' }) => {
  const authUser = useSelector(({ auth }) => auth.user);
  return authUser ? <Navigate to={redirectTo} replace /> : <Outlet />;
};

GuestOnly.propTypes = { redirectTo: PropTypes.string };
export default GuestOnly;
