# Playwright Configuration Documentation

This document outlines the central configuration for the Playwright automation framework. The `playwright.config.ts` file dictates how tests are executed, defining global timeouts, browser settings, and project dependencies.

---

## Global Execution & Timeouts

This section controls how long tests are allowed to run and how they behave during execution.

* **Test Directory:** `./tests` — The framework looks for all test files within this folder.
* **Parallel Execution:** `fullyParallel: true` — Tests run simultaneously across multiple workers to speed up execution time.
  * **Example:** We can run the same test simultaneously for Chrome, Firefox, Edge, and even on mobile viewports.
* **Step Timeout:** `30,000 ms` (30 seconds) — Maximum time allowed for a single step/assertion to complete before failing.
  * **Example:** If your script tries to `await page.click('#submit-btn')`, Playwright will wait up to 30 seconds for that button to become visible and clickable. If the button doesn't load in that time (e.g., due to a slow network or a bug), that specific step fails.
* **Global Timeout:** `90,000 ms` (90 seconds) — Maximum time allowed for an entire test block to execute from start to finish.
  * **Example:** If an end-to-end test includes logging in, navigating to a dashboard, filling out a form, and verifying a success message, the combined time for *all* of those actions cannot exceed 90 seconds. If the test is still running at the 91-second mark, Playwright aborts it completely.
---

## Shared Browser Settings (`use`)

These settings apply globally to all browser contexts unless explicitly overridden inside a specific test.

| Setting | Value | Description |
| :--- | :--- | :--- |
| **baseURL** | `https://betterlaspinas.org/` | The root URL for the application under test. Allows the use of relative paths in scripts (e.g., `page.goto('/')`). |
| **testIdAttribute** | `data-test` | Overrides the default `data-testid` attribute. Locators will rely on custom `data-test` tags for stable element selection. |
**actionTimeout** | `0` | **Disables** the specific timeout for individual actions (like `.click()` or `.fill()`). By setting this to 0, these actions will instead rely on the global **Step Timeout** (30s). |
| **trace** | `"on"` | Captures a full DOM snapshot, console logs, and network requests for **all** test runs to aid in deep debugging. |
| **video** | `"retain-on-failure"` | Records test execution video, but only saves it if the test fails. |
| **screenshot** | `"only-on-failure"` | Automatically captures a visual snapshot of the DOM at the exact moment a test fails. |
| **headless** | `true` | Tests execute in the background without launching a visible browser UI. |
| **ignoreHTTPSErrors** | `true` | Bypasses SSL certificate validation, which is useful for testing against local or staging environments. |

---

## Project Configurations

Projects define the specific environments and browsers where tests will execute. Currently, the framework is optimized for **Desktop Chromium** with a pre-test setup phase.

### 1. Setup Project (`setup`)
* **Purpose:** Runs global setup files before actual test execution begins (e.g., handling authentication, setting up cookies, or database seeding).
* **Target:** Looks specifically for files matching the `/.*\.setup.ts/` regex pattern.

### 2. Chromium Project (`chromium`)
* **Dependencies:** `["setup"]` — Ensures the setup project successfully completes before any Chromium tests run.
* **Permissions:** `["clipboard-read"]` — Grants tests the ability to interact with and validate clipboard contents.

---

## Continuous Integration (CI) Handling

The configuration is smart enough to detect if it is running in a local environment or a CI pipeline (like GitHub Actions), automatically adjusting specific parameters:

* **Forbid Only:** Fails the CI build automatically if `test.only()` was accidentally left in the source code.
* **Retries:** Tests will retry up to **2 times** upon failure in CI environments to account for flakiness, but will not retry locally.
* **Workers:** Limits execution to **2 parallel workers** in CI to prevent resource exhaustion, while utilizing all available system cores locally.