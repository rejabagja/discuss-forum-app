import { BiMoon, BiSun } from 'react-icons/bi';
import PropTypes from 'prop-types';

const ThemeToggle = ({ className, theme, toggleTheme }) => {
  return (
    <button
      className={`btn btn-circle text-accent-darker bg-base-100/5 text-2xl ${className}`}
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      <BiSun className="hidden dark:block" />
      <BiMoon className="dark:hidden" />
    </button>
  );
};

ThemeToggle.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['light', 'dark']).isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default ThemeToggle;
