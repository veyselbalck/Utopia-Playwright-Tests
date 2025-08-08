const { test, expect } = require('@playwright/test');
const config = require("./config");

test('stock movement update', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

      // Stok movement listesine  git
    await page.click('a:has-text("Stocks")');
    await page.click('a[href="/stocks/movements/"]');
    await expect(page).toHaveURL(config.urls.StockMovementPage);

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
       // stock item seçimi daha yapılmadı
    await page.click('#id_stock_item'); // Select2 kutusunu aç
    await page.click('#id_stock_item:has-text("asd")'); // Seç

    // movement type
    await page.click('#id_movement_type'); // Select2 kutusunu aç
    await page.click('#id_movement_type:has-text("Loss")'); // Seç

    // quantity
    await page.waitForSelector('#id_quantity', { visible: true, timeout: 5000 });
    await page.fill('#id_quantity', '100');

    //suplier seçimi
    await page.selectOption('#id_supplier', { label: 'JOHN DOE' });

    // last purchase price
    await page.waitForSelector('#id_price', { visible: true, timeout: 5000 });
    await page.fill('#id_price', '100');

    // reason
    await page.waitForSelector('#id_reason', { visible: true, timeout: 5000 });
    await page.fill('#id_reason', 'John Doe stock movement reason');

      // Formu gönder
      await page.click('button[type="submit"]');

      // Güncelleme sonrası sayfa yüklemesini bekle
      await page.waitForLoadState('networkidle');
      break; // John Doe bulunduğu anda döngüyü sonlandır
    }
  }
});
