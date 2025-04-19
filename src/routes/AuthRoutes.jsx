import { Route } from 'react-router-dom';

const AuthRoutes = (
  <>
    <Route path="/login" element={<p>Login Page</p>} />
    <Route path="/register" element={<p>Register Page</p>} />
  </>
);

export default AuthRoutes;
