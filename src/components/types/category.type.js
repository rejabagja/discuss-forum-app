import PropTypes from 'prop-types';
import { nullableString } from './index';


export const CategoriesShape = {
  list: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: nullableString,
};

export const TypeCategoryItem = {
  category: PropTypes.string.isRequired,
  selectedCategory: nullableString,
  toggleFilter: PropTypes.func.isRequired,
};

export const TypeCategoryList = {
  categories: PropTypes.shape(CategoriesShape).isRequired,
  filter: PropTypes.func.isRequired,
};
