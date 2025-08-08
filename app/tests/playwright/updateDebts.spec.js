const { test, expect } = require('@playwright/test');
const config = require("./config");

test('debt update', async ({ page }) => {
  // Giriş
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');

  // Debts sayfasına git
  await page.click('a.app-menu__item:has-text("Debts")');
  await expect(page).toHaveURL(config.urls.DebtsPage);

  // Tablo yüklensin
  await page.waitForSelector('.table-hover');

  // John Doe satırını bul ve detay linkine tıkla
  const row = page.locator('tr', { hasText: 'John Doe' });
  // Href'i sadece /debt/<id>/ olan bağlantıyı seç (silme linki hariç)
  await row.locator('a[href^="/debt/"]:not([href$="delete/"])').click();
  await page.waitForLoadState('networkidle');

  // Detay sayfası URL kontrolü
  expect(page.url()).toMatch(/\/debt\/\d+\/$/);

  // Edit butonuna tıkla
  await page.click('a.btn.btn-secondary:has-text("Edit")');
  await page.waitForLoadState('networkidle');

  // Edit sayfası URL kontrolü
  expect(page.url()).toMatch(/\/debt\/\d+\/update\/$/);


   //  "Patient" dropdown kutusuna tıklamak için Select2 konteynerini seç
  await page.waitForSelector('#select2-id_customer-container', { timeout: 5000 });
  // `force: true` ile öğeyi tıklama (normal tıklama çalışmazsa zorla tıklama yapalım)
  await page.click('#select2-id_customer-container', { force: true, timeout: 5000 });
  // 3. Arama kutusuna "John Doe" yaz
  await page.fill('input.select2-search__field', 'John Doe');
  // 4. Bekle ve çıkan sonucu seç
  await page.waitForSelector('li.select2-results__option', { timeout: 5000 });
  await page.click('li.select2-results__option');  // İlk çıkan sonucu seç


  // Amount değerini 0 yap
  await page.fill('input#id_amount', '0');

  // Formu gönder
  await page.click('button[type="submit"]');

  // Güncelleme sonrası yüklemeyi bekle (veya yönlendirme)
  await page.waitForLoadState('networkidle');

});





