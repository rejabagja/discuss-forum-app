import CategoryItem from './CategoryItem';
import { TypeCategoryList } from './types/category.type';

const CategoryList = ({ categories, selectedCategory, filter }) => {
  return (
    <div className="category-list flex flex-row gap-3 overflow-x-auto p-2">
      {categories.map((category, index) => (
        <CategoryItem
          key={index}
          category={category}
          selectedCategory={selectedCategory}
          toggleFilter={filter}
        />
      ))}
    </div>
  );
};

CategoryList.propTypes = TypeCategoryList;

export default CategoryList;
