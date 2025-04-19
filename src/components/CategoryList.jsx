import CategoryItem from './CategoryItem';
import { TypeCategoryList } from '@components/types/category.type';

const CategoryList = ({ categories, filter }) => {
  return (
    <div className="category-list flex flex-wrap gap-2">
      {categories.list.map((category, index) => (
        <CategoryItem
          key={index}
          category={category}
          selectedCategory={categories.selectedCategory}
          toggleFilter={filter}
        />
      ))}
    </div>
  );
};

CategoryList.propTypes = TypeCategoryList;

export default CategoryList;
