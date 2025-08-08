const { test, expect } = require('@playwright/test');
const config = require('./config');

test('Geçerli bilgilerle giriş', async ({ page }) => {
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);

  // Giriş yap
  await page.click('button[type="submit"]');

  // Admin paneline yönlendirme kontrolü
  await expect(page).toHaveURL(config.urls.dashboardPage);
  await expect(page.locator('h1')).toHaveText('Calendar');
});
