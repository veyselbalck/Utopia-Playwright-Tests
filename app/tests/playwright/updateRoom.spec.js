const { test, expect } = require('@playwright/test');
const config = require("./config");

test('doctor update', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

   // rooms sayfasına gir
    await page.click('a.app-menu__item:has-text("Rooms")');
    await expect(page).toHaveURL(config.urls.RoomsPage);

  // Tablo yüklensin ve tüm satırlar görünsün diye daha geniş bir bekleme ekleyelim
  await page.waitForSelector('table tbody tr', { timeout: 10000 });

  // Tablodaki tüm satırları al ve her birini kontrol et
  const rows = await page.locator('table tbody tr');
  const rowCount = await rows.count();
  let johnDoeFound = false;

  for (let i = 0; i < rowCount; i++) {
    const rowText = await rows.nth(i).innerText();
    console.log('Row:', rowText);  // Satırdaki tüm metni konsola yazdır
    if (rowText.includes('testroom')) {
      johnDoeFound = true;
      console.log('Found testroom in row:', rowText);

      // "John Doe"yu içeren satırı bulduğunda düzenleme butonuna tıkla
      const editButton = await rows.nth(i).locator('a[href*="/view/"]');
      await editButton.click();


      // Form elemanlarını doldurmak için edite bas
     await page.click('a:has-text("Edit")');
     // Full name
    await page.waitForSelector('#id_name', { visible: true, timeout: 5000 });
    await page.fill('#id_name', 'testroom');

    // type name
    await page.waitForSelector('#id_type', { visible: true, timeout: 5000 });
    await page.fill('#id_type', '0');

     // capacity
    await page.waitForSelector('#id_capacity', { visible: true, timeout: 5000 });
    await page.fill('#id_capacity', '10');


      // Formu gönder
     await page.waitForSelector('button.btn.btn-primary.float-right', { visible: true, timeout: 5000 });
await page.click('button.btn.btn-primary.float-right');

      // Güncelleme sonrası sayfa yüklemesini bekle
      await page.waitForLoadState('networkidle');
      break; // John Doe bulunduğu anda döngüyü sonlandır
    }
  }
});
