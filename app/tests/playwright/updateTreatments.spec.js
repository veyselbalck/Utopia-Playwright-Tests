const { test, expect } = require('@playwright/test');
const config = require("./config");

test('update treatment', async ({ page }) => {
  // Giriş
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');

  // Debts sayfasına git
  await page.click('a.app-menu__item:has-text("Treatment")');
  await expect(page).toHaveURL(config.urls.Treatments);

  // Tablo yüklensin
  await page.waitForSelector('.table-hover');

  // John Doe satırını bul ve detay linkine tıkla
  const row = page.locator('tr', { hasText: '1990-01-01: John Doe' });
  // Href'i sadece /debt/<id>/ olan bağlantıyı seç (silme linki hariç)
  const viewDetailsButton = row.locator('a[href^="/treatment/"][href$="/"]'); // yalnızca view details olan
  await viewDetailsButton.first().click();
  await page.waitForLoadState('networkidle');

  // Detay sayfası URL kontrolü
  expect(page.url()).toMatch(/\/treatment\/\d+\/$/);

  // Edit butonuna tıkla
  await page.click('a.btn.btn-secondary:has-text("Edit")');
  await page.waitForLoadState('networkidle');

  // Edit sayfası URL kontrolü
  expect(page.url()).toMatch(/\/treatment\/\d+\/update\/$/);
  // Form alanlarını doldurmadan önce her bir öğenin görünür olmasını bekleyelim
  await page.waitForSelector('#id_date', { visible: true, timeout: 5000 });
  await page.fill('#id_date', '2026-01-01');

  // Patient (Hasta) seçimi - Hasta (John Doe) seçimi
  const patientOptions = await page.$$('#id_patient option');
  for (const option of patientOptions) {
    const text = await option.textContent();
    if (text.includes('John Doe')) {
      const value = await option.getAttribute('value');
      await page.selectOption('#id_patient', { value }); // `selectOption` içinde doğru kullanımı
      break;
    }
  }

  // Tedavi metni yaz
  await page.fill('#id_treatment', 'Genel muayene yapıldı, tedavi planlandı.');

  // Doctor (Doktor) seçimi - John Doe'yu seç
  const providerOptions = await page.$$('#id_provider option');
  for (const option of providerOptions) {
    const text = await option.textContent();
    if (text.includes('John Doe')) {
      const value = await option.getAttribute('value');
      await page.selectOption('#id_provider', { value }); // `selectOption` içinde doğru kullanımı
      break;
    }
  }


  // Formu gönder
  await page.click('button[type="submit"]');

  // Güncelleme sonrası yüklemeyi bekle (veya yönlendirme)
  await page.waitForLoadState('networkidle');

});





