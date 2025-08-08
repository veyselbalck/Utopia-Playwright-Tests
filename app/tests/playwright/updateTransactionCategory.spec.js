const { test, expect } = require('@playwright/test');
const config = require("./config");

test('update transaction category', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

      // transaction category sayfasına gir
    await page.click('a.app-menu__item:has-text("Transaction Category")');
    await expect(page).toHaveURL(config.urls.TransactionCategoryPage);

  // Tablo yüklensin ve tüm satırlar görünsün diye daha geniş bir bekleme ekleyelim
  await page.waitForSelector('table tbody tr', { timeout: 10000 });

  // Tablodaki tüm satırları al ve her birini kontrol et
  const rows = await page.locator('table tbody tr');
  const rowCount = await rows.count();
  let johnDoeFound = false;

  for (let i = 0; i < rowCount; i++) {
    const rowText = await rows.nth(i).innerText();
    console.log('Row:', rowText);  // Satırdaki tüm metni konsola yazdır
    if (rowText.includes('testcategory')) {
      johnDoeFound = true;
      console.log('Found testcategory in row:', rowText);

      // "John Doe"yu içeren satırı bulduğunda düzenleme butonuna tıkla
       const row = await page.locator('tr:has(td:text("testcategory"))');
       await row.locator('a >> nth=0').click();

       await page.screenshot({ path: 'screenshot.png', fullPage: true });
 await page.click('a.btn.btn-secondary:has-text("Edit")');
  await page.waitForLoadState('networkidle');
      // Form elemanlarını doldur
       // Full name
    await page.waitForSelector('#id_name', { visible: true, timeout: 5000 });
    await page.fill('#id_name', 'testcategory');

     // transactions type  seçimi daha yapılmadı
    await page.click('#id_category'); // Select2 kutusunu aç
    await page.click('#id_category:has-text("Other")'); // Seç
      // Formu gönder
      await page.click('button[type="submit"]');

      // Güncelleme sonrası sayfa yüklemesini bekle
      await page.waitForLoadState('networkidle');
      break; // John Doe bulunduğu anda döngüyü sonlandır
    }
  }
});

