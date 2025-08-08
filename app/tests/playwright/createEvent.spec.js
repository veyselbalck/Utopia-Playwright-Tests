const { test, expect } = require('@playwright/test');
const config = require('./config');

test('Etkinlik oluşturma', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

  // Etkinlik listesine git
  await page.click('a.app-menu__item:has-text("Events")');
  await expect(page).toHaveURL(config.urls.EventPage);

  // 'Create' butonuna tıkla ve yeni sekmenin açılmasını bekle
  const createButton = page.locator('button:has-text("Create")');
  const [newTab] = await Promise.all([
    page.context().waitForEvent('page'),
    createButton.click(),
  ]);

  await newTab.waitForLoadState('load');
  await expect(newTab).toHaveURL(config.urls.AddEvent);

  // Title,description ve tarih doldur
  await newTab.fill('#id_title', 'Playwright Test Event');
  await newTab.fill('#id_description', 'This is a test description for the event.');


  // Doktor seç (select2)
  await newTab.click('#select2-id_doctor-container');
  await newTab.fill('.select2-search__field', 'John Doe');
  await newTab.keyboard.press('Enter');

  // Hasta seç (select2 multiple)
    const patientSelector = '#div_id_patients .select2-selection';
  await newTab.click(patientSelector);
  await newTab.fill('.select2-search__field', 'John Doe');
  await newTab.waitForTimeout(500); // AJAX sonucu için bekleme
  await newTab.keyboard.press('Enter');

  // Oda seçimi (Test Room)
await newTab.click('#select2-id_room-container'); // Select2 dropdown'u aç
await newTab.fill('.select2-search__field', 'Test Room'); // "Test Room" için arama yap
await newTab.waitForTimeout(500); // Sonuçların gelmesini bekle
await newTab.keyboard.press('Enter'); // İlk eşleşeni seç

  // Tarih (örnek: 2025-05-01)
  await newTab.fill('#id_start', '2025-05-01');


  // "All day" checkbox'ı işaretle
  const allDayCheckbox = newTab.locator('#id_all_day');
  if (!(await allDayCheckbox.isChecked())) {
    await allDayCheckbox.check();
  }

  // "Is recurring" checkbox'ı işaretliyse kaldır
  const isRecurringCheckbox = newTab.locator('#id_is_recurring');
  if (await isRecurringCheckbox.isChecked()) {
    await isRecurringCheckbox.uncheck();
  }

  // Submit
  await newTab.click('button[type="submit"]');

  // etklik listesine dönmüyor


});
