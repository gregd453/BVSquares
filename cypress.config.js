const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },

  env: {
    // Environment variables for tests
    CYPRESS_BASE_URL: 'http://localhost:3000',
    TEST_USER_EMAIL: 'test@example.com',
    TEST_USER_PASSWORD: 'testpassword123',
    TEST_ADMIN_EMAIL: 'admin@example.com',
    TEST_ADMIN_PASSWORD: 'adminpassword123'
  }
});