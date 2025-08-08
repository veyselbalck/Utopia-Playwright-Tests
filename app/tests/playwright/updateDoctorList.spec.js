const { test, expect } = require('@playwright/test');
const config = require("./config");

test('doctor update', async ({ page }) => {
  // Giriş
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');

  // Debts sayfasına git
  await page.click('a.app-menu__item:has-text("Doctors")');
  await expect(page).toHaveURL(config.urls.DoctorsPage);

  // Tablo yüklensin
  await page.waitForSelector('.table-hover');

  // John Doe satırını bul ve detay linkine tıkla
  const row = page.locator('tr', { hasText: 'John Doe' });
  // Href'i sadece /debt/<id>/ olan bağlantıyı seç (silme linki hariç)
  await row.locator('a[href^="/doctors/"]:not([href$="delete/"])').click();
  await page.waitForLoadState('networkidle');

  // Detay sayfası URL kontrolü
  expect(page.url()).toMatch(/\/doctors\/\d+\/$/);

  // Edit butonuna tıkla
  await page.click('a.btn.btn-secondary:has-text("Edit")');
  await page.waitForLoadState('networkidle');

  // Edit sayfası URL kontrolü
  expect(page.url()).toMatch(/\/doctors\/\d+\/edit\/$/);

  // Full name
    await page.waitForSelector('#id_full_name', { visible: true, timeout: 5000 });
    await page.fill('#id_full_name', 'John Doe');

    // OCCUPATİON
    await page.waitForSelector('#id_occupation', { visible: true, timeout: 5000 });
    await page.fill('#id_occupation', 'John Doe');

    // Email
    await page.waitForSelector('#id_email', { visible: true, timeout: 5000 });
    await page.fill('#id_email', 'john.doe@example.com');

        // Phone Number
    await page.waitForSelector('#id_phone_number', { visible: true, timeout: 5000 });
    await page.fill('#id_phone_number', '5551234567');



  // Formu gönder
  await page.click('button[type="submit"]');

  // Güncelleme sonrası yüklemeyi bekle (veya yönlendirme)
  await page.waitForLoadState('networkidle');

});





