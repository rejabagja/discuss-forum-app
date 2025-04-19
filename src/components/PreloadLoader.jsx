import { useSelector } from 'react-redux';

const PreloadLoader = () => {
  const theme = useSelector(({ theme }) => theme);
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center font-ibm"
      data-theme={theme}
    >
      <p className="text-lg">
        <span className="loading loading-spinner loading-xs"></span> Loading ...
      </p>
    </div>
  );
};

export default PreloadLoader;
