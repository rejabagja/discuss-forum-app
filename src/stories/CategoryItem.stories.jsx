import CategoryItem from '@components/CategoryItem';
import { useState } from 'react';

export default {
  title: 'Components/CategoryItem',
  component: CategoryItem,
  argTypes: {
    category: { description: 'category name / label' },
    selectedCategory: {
      description: 'currently selected category on this app / page',
      control: { type: 'text' },
    },
    toggleFilter: {
      description: 'function to toggle this category as selected category',
    },
  },
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: false,
  },
  args: {
    toggleFilter: () => {},
  },
};

export const Default = {
  args: {
    category: 'Category A',
  },
  argTypes: {
    selectedCategory: { control: { disable: true } },
  },
};

export const Selected = {
  args: {
    category: 'Category A',
    selectedCategory: 'Category A',
  },
  argTypes: {
    category: { control: { disable: true } },
    selectedCategory: { control: { disable: true } },
  },
};

const WithToggleFilter = ({ categoryName }) => {
  const category = categoryName;
  const [selectedCategory, setSelectedCategory] = useState(null);
  const toggleFilter = () => {
    if (selectedCategory === category) {
      setSelectedCategory(null);
    } else {
      setSelectedCategory(category);
    }
  };
  return (
    <CategoryItem
      category={category}
      selectedCategory={selectedCategory}
      toggleFilter={toggleFilter}
    />
  );
};

export const WithToggleFilterAction = {
  render: () => <WithToggleFilter categoryName="Storybook" />,
  argTypes: {
    selectedCategory: { control: { disable: true } },
  },
};
