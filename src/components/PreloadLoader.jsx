import { useSelector } from 'react-redux';

const PreloadLoader = () => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center font-ibm"
      data-theme={theme}
    >
      <p className="text-lg flex flex-row gap-2 items-center justify-center">
        <span className="loading loading-spinner loading-xs"></span> Loading{' '}
        <span className="loading loading-dots loading-xs"></span>
      </p>
    </div>
  );
};

export default PreloadLoader;
