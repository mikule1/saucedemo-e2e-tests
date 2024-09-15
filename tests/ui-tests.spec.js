const { test, expect } = require('@playwright/test');

test.describe('Login Functionality', () => {
  test('Successful login with valid credentials', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('/inventory.html');
  });

  test('Failed login with invalid credentials', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'invalid_user');
    await page.fill('#password', 'invalid_password');
    await page.click('#login-button');
    const errorMessage = await page.locator('[data-test="error"]');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toContainText('Username and password do not match any user in this service');
  });

  test('Logout functionality', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('/inventory.html');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL('/');
  });
});

test.describe('Visual Regression Tests', () => {
  test('Login page visual comparison', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot('login-page.png');
  });

  test('Inventory page visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('/inventory.html');
    await expect(page).toHaveScreenshot('inventory-page.png');
  });

  test('Product details page visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.click('.inventory_item:first-child .inventory_item_name');
    await expect(page).toHaveScreenshot('product-details-page.png');
  });

  test('Cart page visual comparison', async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.click('.inventory_item:first-child .btn_inventory');
    await page.click('.shopping_cart_link');
    await expect(page).toHaveScreenshot('cart-page.png');
  });
});

test.describe('Product Listing and Sorting', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL('/inventory.html');
  });

  test('Verify all products are displayed on the inventory page', async ({ page }) => {
    const products = await page.$$('.inventory_item');
    expect(products.length).toBe(6);
  });

  test('Test sorting functionality', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'Price (low to high)');
    const prices = await page.$$eval('.inventory_item_price', elements => elements.map(el => parseFloat(el.textContent.replace('$', ''))));
    for (let i = 1; i < prices.length; i++) {
      expect(prices[i]).toBeGreaterThanOrEqual(prices[i-1]);
    }
  });

  test('Add a product to the cart and verify the cart badge updates', async ({ page }) => {
    await page.click('.inventory_item:first-child .btn_inventory');
    const cartBadge = page.locator('.shopping_cart_badge');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });
});