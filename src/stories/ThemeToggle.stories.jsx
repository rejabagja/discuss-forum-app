import { useState } from 'react';
import ThemeToggle from '@components/ThemeToggle';

export default {
  title: 'Components/ThemeToggle',
  component: ThemeToggle,
  argTypes: {
    className: {
      control: { disable: true },
      description: 'additional class name',
    },
    theme: {
      description: 'current theme app',
    },
    toggleTheme: {
      description: 'function to toggle theme',
    },
  },
  tags: ['autodocs'],
  parameters: {
    backgrounds: false,
    layout: 'centered',
  },
  globals: {
    theme: false,
  },
  args: {
    toggleTheme: () => {},
  },
};

const Template = (args) => {
  return (
    <div
      className="h-52 w-52 flex items-center justify-center border-[1px] shadow"
      data-theme={args.theme}
    >
      <ThemeToggle {...args} />
    </div>
  );
};

export const Light = {
  args: {
    theme: 'light',
  },
  render: (args) => <Template {...args} />,
};

export const Dark = {
  args: {
    theme: 'dark',
  },
  render: (args) => <Template {...args} />,
};

const WithThemeToggle = (args) => {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');

  return (
    <div
      className="h-52 w-52 flex items-center justify-center border-[1px] shadow"
      data-theme={theme}
    >
      <ThemeToggle {...args} theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
};

export const SwitchableTheme = {
  argTypes: {
    theme: { control: { disable: true } },
  },
  render: (args) => <WithThemeToggle {...args} />,
};
