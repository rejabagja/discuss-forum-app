import { FiBarChart2, FiLogIn, FiLogOut } from 'react-icons/fi';
import { BiChat } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { clearAuthUser } from '@states/slices/auth';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import api from '@utils/api';
import { useOnline } from '@hooks';

const FooterApp = () => {
  const dispatch = useDispatch();
  const isOnline = useOnline();
  const authUser = useSelector(({ auth }) => auth.user);

  const onLogout = () => {
    if (!isOnline) return;
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      customClass: {
        popup: 'font-ibm w-96',
        icon: 'w-14 h-14',
        title: 'text-2xl font-bold pt-2',
        confirmButton: 'bg-primary',
        cancelButton: 'bg-error',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        api.removeAccessToken();
        dispatch(clearAuthUser());
        toast.success('You have been logged out.');
      }
    });
  };

  return (
    <footer>
      <nav className="btm-nav max-w-3xl mx-auto border-accent border-x-2 border-t-2 rounded-tl-lg rounded-tr-lg shadow-lg dark:bg-none bg-gradient-to-b from-white to-purple-100">
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
