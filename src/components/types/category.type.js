import PropTypes from 'prop-types';
import { nullableString } from './index';


export const TypeCategoryItem = {
  category: PropTypes.string.isRequired,
  selectedCategory: nullableString,
  toggleFilter: PropTypes.func.isRequired,
};

export const TypeCategoryList = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: nullableString,
  filter: PropTypes.func.isRequired,
};
