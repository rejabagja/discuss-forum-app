import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <section className="not-found-page flex-1 flex flex-col justify-center">
      <div className="w-full max-w-xl mx-auto text-center">
        <h2 className="font-semibold text-xl mb-2">
          <span className="text-error">404</span> | Page Not Found
        </h2>
        <p className="mb-4">The page you are looking for does not exist.</p>
        <p className="mt-2 text-center text-sm">
          <Link to="/" className="link text-secondary">
            Back to Home
          </Link>
        </p>
      </div>
    </section>
  );
};

export default PageNotFound;
