const { test, expect } = require('@playwright/test');
const config = require("./config");

test('update package', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

  // Package listesine git
    await page.click('a:has-text("Packages")');
    await page.click('a[href="/package/"]');
    await expect(page).toHaveURL(config.urls.PackagePage);

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

   //total Sessions
    await page.waitForSelector('#id_total_sessions', { visible: true, timeout: 5000 });
    await page.fill('#id_total_sessions', '100');

    //Service  seçimi
     // "Service" dropdown menüsüne tıklayın
  await page.click('#id_service_choice');
  // " | None" seçeneğini seçin, value="examinationcatalog-1" olduğu için
  await page.selectOption('#id_service_choice', { value: 'examinationcatalog-1' });

      // Formu gönder
      await page.click('button[type="submit"]');

      // Güncelleme sonrası sayfa yüklemesini bekle
      await page.waitForLoadState('networkidle');
      break; // John Doe bulunduğu anda döngüyü sonlandır
    }
  }
});
