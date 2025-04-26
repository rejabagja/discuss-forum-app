const FetchDataError = ({ error }) => {
  const shouldSuggestRefresh =
    error.message === 'Network Error' || error.message === 'failed to fetch';

  return (
    <section className="data-error flex-1 flex flex-col justify-center">
      <div className="w-full max-w-xl mx-auto text-center flex flex-col gap-2">
        <h3>Something went wrong...</h3>
        <h2 className="text-2xl text-error font-medium">{error.statusCode}</h2>
        <p>Error: {error.message}</p>
        {shouldSuggestRefresh && (
          <p className="text-sm -mt-1">*Try refreshing the page.</p>
        )}
      </div>
    </section>
  );
};

export default FetchDataError;
