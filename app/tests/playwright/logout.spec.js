const { test, expect } = require('@playwright/test');
const config = require("./config");
test('Çıkış yapma', async ({ page }) => {
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
  
    // Çıkış yap

     await page.click('a[aria-label="Open Profile Menu"]')
    await page.click('a:has-text("Sign out")')
  
    // Çıkış sonrası giriş sayfasına yönlendirme
    await expect(page).toHaveURL(config.urls.loginPage);
  });

