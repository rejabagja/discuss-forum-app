import HeaderApp from '@components/HeaderApp';
import FooterApp from '@components/FooterApp';
import ThemeToggle from '@components/ThemeToggle';
import { useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { useEffect } from 'react';
import { setAppTheme } from '@utils';
import PropTypes from 'prop-types';
import { useOnline } from '@hooks';
import PageOffline from '@components/PageOffline';

const LayoutApp = ({ children }) => {
  const isOnline = useOnline();
  const theme = useSelector(({ theme }) => theme);

  useEffect(() => {
    setAppTheme(theme);
  }, [theme]);

  return (
    <div className="font-ibm min-h-screen flex flex-col" data-theme={theme}>
      <HeaderApp />
      <main className="flex-1 flex flex-col pt-16 dark:bg-none bg-gradient-to-br from-white to-purple-100">
        <ToastContainer className="top-20 right-5" />
        <ThemeToggle />
        <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto pt-6 px-5 sm:px-6 pb-24 shadow bg-base-100/20 dark:bg-base-100/40">
          {isOnline ? children : <PageOffline />}
        </div>
      </main>
      <FooterApp />
    </div>
  );
};

LayoutApp.propTypes = {
  children: PropTypes.node,
};

export default LayoutApp;
