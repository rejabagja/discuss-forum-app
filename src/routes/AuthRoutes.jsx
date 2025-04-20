import { Route } from 'react-router-dom';
import PageLogin from '@pages/_auth/login';
import PageRegister from '@pages/_auth/register';

const AuthRoutes = (
  <>
    <Route path="/login" element={<PageLogin />} />
    <Route path="/register" element={<PageRegister />} />
  </>
);

export default AuthRoutes;
