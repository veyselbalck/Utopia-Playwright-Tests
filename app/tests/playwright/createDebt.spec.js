const { test, expect } = require('@playwright/test');
const config = require("./config");

// Yeni borç kaydı oluşturma
test('see and create debt', async ({ page }) => {
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');

     // Debts sayfasına gir
    await page.click('a.app-menu__item:has-text("Debts")');
    await expect(page).toHaveURL(config.urls.DebtsPage);

    // 'Create' butonuna tıkla
    const createButton = page.locator('button:has-text("Create")');

    // Yeni sekme açılacak, önceki tıklamayı bekle
    const [newTab] = await Promise.all([
        page.context().waitForEvent('page'), // Yeni sekme açıldığında bekle
        createButton.click(), // Tıklama işlemi
    ]);

    // Yeni sekme açıldıktan sonra, o sekmeye geçiş yap
    await newTab.waitForLoadState('load'); // Sayfa tamamen yüklendikten sonra geçiş yap

    // Yeni sekmede doğru URL'yi kontrol et
    console.log(await newTab.url()); // Hangi URL'ye yönlendirildiğini görmek için konsola yazdır
    await expect(newTab).toHaveURL(config.urls.AddDebts);

     // Form alanlarının yüklenmesini bekleyelim
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
    // Amount (Tutar)
    await newTab.waitForSelector('#id_amount', { visible: true, timeout: 5000 });
    await newTab.fill('#id_amount', '100'); // Tutarı istediğiniz gibi değiştirebilirsiniz.

    // submit  butonuna tıkla
    await newTab.click('button[type="submit"]');
    // Başarıyla yönlendirildiyse doğrulama
  await expect(newTab).toHaveURL(/.*\/debt\/?/); // Başarıyla yönlendirildiyse kontrol et


});