import HeaderApp from './HeaderApp';

const PageOffline = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen text-center">
      <HeaderApp />
      <h1 className="text-2xl font-bold">You're offline</h1>
      <p className="text-lg mt-2">Please check your internet connection.</p>
    </section>
  );
};

export default PageOffline;
