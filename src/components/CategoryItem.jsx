import { TypeCategoryItem } from './types/category.type';

const CategoryItem = ({ category, selectedCategory, toggleFilter }) => {
  const isSelected = category === selectedCategory;
  return (
    <button
      className={`px-2 py-1 outline outline-1 rounded-sm shadow-md flex-shrink-0 ${
        isSelected ? 'bg-secondary text-secondary-content' : ''
      }`}
      onClick={() => toggleFilter(category)}
    >
      #{category}
    </button>
  );
};

CategoryItem.propTypes = TypeCategoryItem;

export default CategoryItem;
