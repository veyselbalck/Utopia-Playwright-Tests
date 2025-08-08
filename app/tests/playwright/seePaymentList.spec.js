const { test, expect } = require('@playwright/test');
const config = require('./config');

test('Ödeme listesi görüntüleme', async ({ page }) => {
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // Ödeme listesine git
    await page.click('a.app-menu__item:has-text("Payments")');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(config.urls.Payments);

});