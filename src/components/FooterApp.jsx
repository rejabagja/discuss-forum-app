import { FiBarChart2, FiLogIn, FiLogOut } from 'react-icons/fi';
import { BiChat } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuthUser } from '@states/auth-user';

const FooterApp = () => {
  const { authUser, theme } = useSelector(({ authUser, theme }) => ({
    authUser: authUser.data,
    theme,
  }));
  const dispatch = useDispatch();
  const onLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      dispatch(clearAuthUser());
    }
  };

  return (
    <footer>
      <nav
        className={`btm-nav max-w-3xl mx-auto border-accent border-x-2 border-t-2 rounded-tl-lg rounded-tr-lg shadow-lg ${
          theme === 'dark'
            ? 'bg-none'
            : 'bg-gradient-to-b from-white to-purple-100'
        }`}
      >
        <Link
          to="/"
          className="hover:bg-secondary hover:text-secondary-content rounded-tl-md"
        >
          <BiChat />
          <span className="btm-nav-label">Threads</span>
        </Link>
        <Link
          to="/leaderboards"
          className="hover:bg-secondary hover:text-secondary-content"
        >
          <FiBarChart2 />
          <span className="btm-nav-label">Leaderboards</span>
        </Link>
        {authUser ? (
          <button
            className="hover:bg-secondary hover:text-secondary-content rounded-tr-md"
            onClick={onLogout}
          >
            <FiLogOut />
            <span className="btm-nav-label">Logout</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="hover:bg-secondary hover:text-secondary-content rounded-tr-md"
          >
            <FiLogIn />
            <span className="btm-nav-label">Login</span>
          </Link>
        )}
      </nav>
    </footer>
  );
};

export default FooterApp;
