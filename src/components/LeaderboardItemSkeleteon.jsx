const LeaderboardItemSkeleteon = () => {
  return (
    <div className="flex flex-col gap-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-3">
            <div className="avatar">
              <div className="w-8 rounded-full bg-base-300/80 skeleton" />
            </div>
            <div className="h-4 w-40 bg-base-300/80 rounded skeleton" />
          </div>
          <div className="h-4 w-8 bg-base-300/80 rounded skeleton" />
        </div>
      ))}
    </div>
  );
};

export default LeaderboardItemSkeleteon;
