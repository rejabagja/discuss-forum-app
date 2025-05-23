import { Route } from 'react-router-dom';
import { PageLogin, PageRegister } from '@pages';

const AuthRoutes = (
  <>
    <Route path="/login" element={<PageLogin />} />
    <Route path="/register" element={<PageRegister />} />
  </>
);

export default AuthRoutes;
