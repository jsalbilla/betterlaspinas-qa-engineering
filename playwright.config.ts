import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  // Look for test files in the "tests" directory, relative to this configuration file.
  testDir: './tests',

  //Seting up timeout for each test steps.
  timeout: 30_000, // 30 seconds
  //Seting up global timeout for each test.
  globalTimeout: 90_000, // 90 seconds


  /* Run tests in files in parallel */
  fullyParallel: true,


  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL:'https://betterlaspinas.org/',
    testIdAttribute: 'data-test',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    //Allows you to collect trace for all tests. Options are "on", "off", "retain-on-failure", "on-first-retry"
    trace: "on",

    //Timeout for each action like click(), fill() etc.
    actionTimeout: 0, 

    //Ignore HTTPS errors, such as self-signed certificates. Useful for testing in development environments.
    ignoreHTTPSErrors: true, 

    //Record video only when a test fails. Videos are saved in the "test-results" directory.
    video: "retain-on-failure",

    //Take a screenshot only when a test fails. Screenshots are saved in the "test-results" directory.
    screenshot: "only-on-failure",

    //Run tests in headless mode. Set to false if you want to see the browser during test execution.
    headless: true,

  },

  /* Configure projects for major browsers */
  projects: [
   {
      name: "setup", //a setup project to run setup files
      testMatch: /.*\.setup.ts/, // only runs setup files
    },
    
    {
      name: "chromium",
      //ensures setup project runs before this one, allowing us to set up the environment (e.g., log in) before running tests that require it.
      dependencies: ["setup"], 

      //grants clipboard read permission to the tests running in this project, allowing them to access the clipboard content during test execution.
      use: { ...devices["Desktop Chrome"], permissions: ["clipboard-read"] }, 
    },




    // {
    //   name: 'firefox',
    //   //ensures setup project runs before this one, allowing us to set up the environment (e.g., log in) before running tests that require it.
    //   dependencies: ["setup"],
    //   use: { ...devices['Desktop Firefox'] },
    // },

    // {
    //   name: 'webkit',
    //   //ensures setup project runs before this one, allowing us to set up the environment (e.g., log in) before running tests that require it.
    //   dependencies: ["setup"],
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
