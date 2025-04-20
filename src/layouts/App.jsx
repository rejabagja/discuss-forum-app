import HeaderApp from '@components/HeaderApp';
import FooterApp from '@components/FooterApp';
import { Outlet } from 'react-router-dom';
import ThemeToggle from '@components/ThemeToggle';
import { useSelector } from 'react-redux';

const LayoutApp = () => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <div className="font-ibm min-h-screen flex flex-col" data-theme={theme}>
      <HeaderApp />
      <main
        className={`flex-1 flex flex-col pt-16 ${
          theme === 'dark'
            ? 'bg-none'
            : 'bg-gradient-to-br from-white to-purple-100'
        }`}
      >
        <ThemeToggle />
        <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto p-5 border-accent border-x-2 border-dashed shadow pb-24">
          <Outlet />
        </div>
      </main>
      <FooterApp />
    </div>
  );
};

export default LayoutApp;
