import { Link } from 'react-router-dom';
import { TypeAuthPageWrapper } from './types';

const AuthPageWrapper = ({ title, subtitle, children, linkAction }) => {
  return (
    <section className="auth-page flex-1 flex flex-col justify-center">
      <div className="auth-page__content max-w-sm w-full mx-auto">
        <h2 className="font-semibold text-2xl mb-2">{title}</h2>
        <p className="mb-4">{subtitle}</p>
        {children}
        <p className="mt-2 text-center text-sm">
          {linkAction === 'login'
            ? 'Already have an account? '
            : "Don't have an account? "}
          <Link to={`/${linkAction}`} className="link text-secondary">
            {linkAction}
          </Link>
        </p>
      </div>
    </section>
  );
};

AuthPageWrapper.propTypes = TypeAuthPageWrapper;

export default AuthPageWrapper;
