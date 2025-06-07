import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    pageLoadTimeout: 20000,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
