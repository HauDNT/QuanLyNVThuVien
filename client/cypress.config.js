const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'wvc8oh',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
