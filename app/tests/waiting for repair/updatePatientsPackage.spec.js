const { test, expect } = require('@playwright/test');
const config = require("../playwright/config");

test('update patient package', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

 // Package listesine git
    await page.click('a:has-text("Packages")');
    await page.click('a[href="/package/patient-packages/"]');
    await expect(page).toHaveURL(config.urls.PatientPackagePage);

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
       // Select2 kutusunu aç
    await page.click('#select2-id_patient-container');
    await page.waitForSelector('.select2-results__option'); // Açılan seçenekleri bekle
    await page.click('li.select2-results__option:has-text("2000-01-01: John Doe")');

    //select package
    await page.click('#select2-id_package-container');
    await page.waitForSelector('.select2-results__option'); // Açılan seçenekleri bekle
    await page.click('li.select2-results__option:has-text("JOHN DOE (100 sessions)")');

   // date
     await page.waitForSelector('#id_start_date', { visible: true, timeout: 5000 });
  await page.fill('#id_start_date', '1990-01-01');

   //status
    await page.click('#id_status');
    await page.click('#id_status:has-text("Paused")');
      // Formu gönder
      await page.click('button[type="submit"]');

      // Güncelleme sonrası sayfa yüklemesini bekle
      await page.waitForLoadState('networkidle');
      break; // John Doe bulunduğu anda döngüyü sonlandır
    }
  }
});
