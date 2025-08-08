const { test, expect } = require('@playwright/test');
const config = require("./config");


test('Tedavi kaydı oluşturma', async ({ page }) => {
  // Admin paneline giriş yap
  await page.goto(config.urls.loginPage);
  await page.fill('#id_email', config.credentials.email);
  await page.fill('#id_password', config.credentials.password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(config.urls.dashboardPage);

  // Treatments sayfasına git
  await page.click('a.app-menu__item:has-text("Treatment")');
  await expect(page).toHaveURL(config.urls.Treatments);

  // 'Create' butonuna tıkla
  const createButton = page.locator('button:has-text("Create")');

  // Yeni sekme açılacak, önceki tıklamayı bekle
  const [newTab] = await Promise.all([
    page.context().waitForEvent('page'), // Yeni sekme açıldığında bekle
    createButton.click(), // Tıklama işlemi
  ]);

  // Yeni sekme açıldıktan sonra, o sekmeye geçiş yap
  await newTab.waitForLoadState(); // Yeni sekme tamamen yüklenene kadar bekle

  // Yeni sekmede doğru URL'yi kontrol et
  await expect(newTab).toHaveURL(config.urls.AddTreatment);

  // Yeni sekme açıldıktan sonra, sayfanın tamamen yüklenmesini bekle
  await newTab.waitForLoadState('load', { timeout: 10000 });

  // Form alanlarını doldurmadan önce her bir öğenin görünür olmasını bekleyelim
  await newTab.waitForSelector('#id_date', { visible: true, timeout: 5000 });
  await newTab.fill('#id_date', '1990-01-01');

  // Patient (Hasta) seçimi - Hasta (John Doe) seçimi
  const patientOptions = await newTab.$$('#id_patient option');
  for (const option of patientOptions) {
    const text = await option.textContent();
    if (text.includes('John Doe')) {
      const value = await option.getAttribute('value');
      await newTab.selectOption('#id_patient', { value }); // `selectOption` içinde doğru kullanımı
      break;
    }
  }

  // Tedavi metni yaz
  await newTab.fill('#id_treatment', 'Genel muayene yapıldı, tedavi planlandı.');

  // Doctor (Doktor) seçimi - John Doe'yu seç
  const providerOptions = await newTab.$$('#id_provider option');
  for (const option of providerOptions) {
    const text = await option.textContent();
    if (text.includes('John Doe')) {
      const value = await option.getAttribute('value');
      await newTab.selectOption('#id_provider', { value }); // `selectOption` içinde doğru kullanımı
      break;
    }
  }

  // Formu gönder
  await newTab.click('button[type="submit"]');

  // Başarıyla yönlendirildiyse doğrulama
  await expect(newTab).toHaveURL(/.*\/treatment\/?/); // Başarıyla yönlendirildiyse kontrol et
});
