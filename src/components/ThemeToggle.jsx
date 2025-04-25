import { useSelector, useDispatch } from 'react-redux';
import { BiMoon, BiSun } from 'react-icons/bi';
import { toggleTheme } from '@states/theme';

const ThemeToggle = () => {
  const theme = useSelector(({ theme }) => theme);
  const dispatch = useDispatch();

  return (
    <button
      className="fixed top-20 right-5 btn btn-circle text-accent-darker bg-base-100/5 text-2xl z-50"
      onClick={() => dispatch(toggleTheme())}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <BiSun className="hidden dark:block" />
      <BiMoon className="dark:hidden" />
    </button>
  );
};

export default ThemeToggle;
