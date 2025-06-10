/** @type { import('@storybook/react-vite').Preview } */
import { withThemeByDataAttribute } from "@storybook/addon-themes";
import '../src/styles/index.css';
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo"
    }
  },

  decorators: [withThemeByDataAttribute({
      themes: {
          // nameOfTheme: 'dataAttributeForTheme',
          light: 'light',
          dark: 'dark',
      },
      defaultTheme: 'light',
      dataAttribute: 'data-theme',
  })]
};

export default preview;