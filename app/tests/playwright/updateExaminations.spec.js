const { test, expect } = require('@playwright/test');
const config = require("./config");

test('doctor update', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

  // "Catalogs > Examinations" sayfasına git
  await page.click('a:has-text("Catalogs")');
  await page.click('a[href="/catalogs/examinations/"]');
  await expect(page).toHaveURL(config.urls.catalogExamination);

  // Tablo yüklensin ve tüm satırlar görünsün diye daha geniş bir bekleme ekleyelim
  await page.waitForSelector('table tbody tr', { timeout: 10000 });

  // Tablodaki tüm satırları al ve her birini kontrol et
  const rows = await page.locator('table tbody tr');
  const rowCount = await rows.count();
  let johnDoeFound = false;

  for (let i = 0; i < rowCount; i++) {
    const rowText = await rows.nth(i).innerText();
    console.log('Row:', rowText);  // Satırdaki tüm metni konsola yazdır
    if (rowText.includes('John Doe')) {
      johnDoeFound = true;
      console.log('Found John Doe in row:', rowText);

      // "John Doe"yu içeren satırı bulduğunda düzenleme butonuna tıkla
      const editButton = await rows.nth(i).locator('a[href*="/update/"]');
      await editButton.click();

      // Form elemanlarını doldur
      await page.waitForSelector('#id_examination_name', { timeout: 5000 });
      await page.fill('#id_examination_name', 'John Doe');

      await page.fill('#id_price', '100');

      // Select2 kutusunu aç
      await page.click('.select2-selection');
      await page.fill('.select2-search__field', 'John Doe'); // Arama kutusuna yaz
      await page.waitForSelector('.select2-results__option', { timeout: 5000 });
      await page.click('.select2-results__option:has-text("John Doe")'); // Sonucu seç

      await page.fill('#id_description', 'John Doe examination description');
      await page.fill('#id_product_code', '100');

      // Formu gönder
      await page.click('button[type="submit"]');

      // Güncelleme sonrası sayfa yüklemesini bekle
      await page.waitForLoadState('networkidle');
      break; // John Doe bulunduğu anda döngüyü sonlandır
    }
  }
});
