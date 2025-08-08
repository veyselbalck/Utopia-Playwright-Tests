const { test, expect } = require('@playwright/test');
const config = require("../config");

test('doctor update', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

  // "Catalogs > Examinations" sayfasına git
  await page.click('a:has-text("Transactions")');
  await expect(page).toHaveURL(config.urls.TransactionsPage);

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
      const editButton = await rows.nth(i).locator('a[href*="/view/"]');
      await editButton.click();

      // Form elemanlarını doldur
     await page.click('a:has-text("Edit")');
      // Full name
await page.waitForSelector('#id_full_name', { visible: true, timeout: 5000 });
await page.fill('#id_full_name', 'John Doe');

// Birth date
await page.waitForSelector('#id_birth_date', { visible: true, timeout: 5000 });
await page.fill('#id_birth_date', '1990-01-01');

// Gender
await page.waitForSelector('#id_gender', { visible: true, timeout: 5000 });
await page.selectOption('#id_gender', 'male');

// Blood Type
await page.waitForSelector('#id_blood_type', { visible: true, timeout: 5000 });
await page.selectOption('#id_blood_type', 'A Rh +');

// Profession
await page.waitForSelector('#id_profession', { visible: true, timeout: 5000 });
await page.fill('#id_profession', 'Engineer');

// Weight
await page.waitForSelector('#id_weight', { visible: true, timeout: 5000 });
await page.fill('#id_weight', '75');

// Height
await page.waitForSelector('#id_height', { visible: true, timeout: 5000 });
await page.fill('#id_height', '180');

// Email
await page.waitForSelector('#id_email', { visible: true, timeout: 5000 });
await page.fill('#id_email', 'john.doe@example.com');

// Identity Document
await page.waitForSelector('#id_identity_document', { visible: true, timeout: 5000 });
await page.fill('#id_identity_document', '123456789');

// Address
await page.waitForSelector('#id_address', { visible: true, timeout: 5000 });
await page.fill('#id_address', '123 Main St, New York');

// Phone Number
await page.waitForSelector('#id_phone_number', { visible: true, timeout: 5000 });
await page.fill('#id_phone_number', '5551234567');

// Source
 await page.waitForSelector('#id_source', { visible: true, timeout: 5000 });
 await page.fill('#id_source', 'Online Ads');


      // Formu gönder
     await page.waitForSelector('button.btn.btn-primary.float-right', { visible: true, timeout: 5000 });
await page.click('button.btn.btn-primary.float-right');

      // Güncelleme sonrası sayfa yüklemesini bekle
      await page.waitForLoadState('networkidle');
      break; // John Doe bulunduğu anda döngüyü sonlandır
    }
  }
});
