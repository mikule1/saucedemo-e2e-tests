# Saucedemo E2E Testing Framework

This project contains end-to-end (E2E) tests for the Sauce Demo Web Application (https://www.saucedemo.com/) and the Petstore API (https://petstore.swagger.io/).

## Framework Choice

Playwright was chosen for this project due to its ability to handle both UI and API testing smoothly. It offers great cross-browser support and features like auto-wait and network interception.

## Project Structure

- `tests/` 
  - `ui-tests.spec.js`: Contains UI tests
  - `api-tests.spec.js`: Contains API tests
- `playwright.config.js`: Configuration file for Playwright
- `package.json`: Node.js package file with dependencies and scripts

## Test Breakdown

### UI Tests
The UI tests focus on three main areas:
1. Login functionality
2. Visual checks
3. Product listing and sorting

### API Tests
The API tests cover the basic CRUD operations for the Pet resource:
- Creating a pet
- Retrieving a pet
- Updating a pet
- Finding pets by status
- Deleting a pet

## Configuration

The `playwright.config.js` file contains separate configurations for UI and API tests, allowing them to be run independently or together.

## Running Tests

To run the tests, use the following npm scripts:

- All tests: `npm test`
- UI tests: `npm run test:ui`
- API tests: `npm run test:api`

Alternatively, you can use Playwright commands directly:

- All tests: `npx playwright test`
- UI tests: `npx playwright test ui-tests.spec.js`
- API tests: `npx playwright test api-tests.spec.js`

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Install Playwright browsers:
   ```
   npx playwright install
   ```
