const CategoryItemSkeleteon = () => {
  return (
    <div className="flex flex-row gap-2 overflow-x-auto">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="skeleton h-7 w-20 rounded bg-base-300/80 flex-shrink-0"
        ></div>
      ))}
    </div>
  );
};

export default CategoryItemSkeleteon;
