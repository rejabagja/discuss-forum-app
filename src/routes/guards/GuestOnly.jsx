import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const GuestOnly = () => {
  const authUser = useSelector(({ authUser }) => authUser);

  if (authUser.user) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default GuestOnly;
