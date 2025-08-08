const { test, expect } = require('@playwright/test');
const config = require("./config");

test('stock update', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

    // Stok listesine git
    await page.click('a:has-text("Stocks")');
    await page.click('a[href="/stocks/items/"]');
    await expect(page).toHaveURL(config.urls.StockPage);

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
       // Item name
   await page.waitForSelector('#id_name', { visible: true, timeout: 5000 });
   await page.fill('#id_name', 'John Doe');

   // Description
    await page.waitForSelector('#id_description', { visible: true, timeout: 5000 });
    await page.fill('#id_description', 'John Doe examinaton description');

    // category seçimi daha yapılmadı
    await page.click('#id_category'); // Select2 kutusunu aç
    await page.click('#id_category:has-text("Other")'); // Seç

     //suplier seçimi daha yapılmadı
    await page.click('.select2-selection'); // Select2 kutusunu aç
    await page.click('.select2-results__option:has-text("John Doe")'); // Seç

     //unit
    await page.waitForSelector('#id_unit', { visible: true, timeout: 5000 });
    await page.fill('#id_unit', '100');

    // threshold
    await page.waitForSelector('#id_threshold', { visible: true, timeout: 5000 });
    await page.fill('#id_threshold', '100');

    // last purchase price
    await page.waitForSelector('#id_last_purchase_price', { visible: true, timeout: 5000 });
    await page.fill('#id_last_purchase_price', '100');

    // last purchase date
    await page.waitForSelector('#id_last_purchase_date', { visible: true, timeout: 5000 });
    await page.fill('#id_last_purchase_date', '1990-01-01');

    // Add new supplier
   await page.waitForSelector('#id_new_supplier', { visible: true, timeout: 5000 });
   await page.fill('#id_new_supplier', 'John Does');

      // Formu gönder
      await page.click('button[type="submit"]');

      // Güncelleme sonrası sayfa yüklemesini bekle
      await page.waitForLoadState('networkidle');
      break; // John Doe bulunduğu anda döngüyü sonlandır
    }
  }
});
