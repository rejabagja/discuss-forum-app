const ThreadItemSkeleton = () => {
  return (
    <>
      {Array(3)
        .fill(0)
        .map((_, index) => (
          <article
            key={index}
            className="flex flex-col gap-2 border-b-2 border-b-base-300 px-3 py-4 rounded-md"
          >
            <div className="skeleton h-6 w-24 rounded bg-base-300/80"></div>
            <div className="skeleton h-6 w-3/4 rounded bg-base-300/80"></div>
            <div className="skeleton h-20 w-full rounded bg-base-300/80"></div>
            <div className="flex gap-4 items-center pt-2">
              <div className="skeleton h-6 w-12 rounded bg-base-300/80"></div>
              <div className="skeleton h-6 w-12 rounded bg-base-300/80"></div>
              <div className="skeleton h-6 w-12 rounded bg-base-300/80"></div>
              <div className="skeleton h-6 w-16 rounded bg-base-300/80"></div>
              <div className="skeleton h-6 w-32 rounded bg-base-300/80"></div>
            </div>
          </article>
        ))}
    </>
  );
};

export default ThreadItemSkeleton;
