const { test, expect } = require('@playwright/test');
const config = require("./config");

// Yeni ödeme kaydı oluşturma
test('Yeni ödeme kaydı oluşturma', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');

    // Payments sayfasına gir
    await page.click('a.app-menu__item:has-text("Payments")');
    await expect(page).toHaveURL(config.urls.Payments);

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
    await expect(newTab).toHaveURL(config.urls.AddPayment);

    // Form alanlarının yüklenmesini bekleyelim
   // Patient (Hasta) seçimi - Select2 çözümü
    await newTab.click('.select2-selection'); // Select2 kutusunu aç
    await newTab.fill('.select2-search__field', 'John Doe'); // Arama kutusuna yaz
    await newTab.waitForSelector('.select2-results__option', { timeout: 5000 }); // Sonuç gelsin
    await newTab.click('.select2-results__option:has-text("John Doe")'); // Seç
    // Amount (Tutar)
    await newTab.waitForSelector('#id_amount', { visible: true, timeout: 5000 });
    await newTab.fill('#id_amount', '100'); // Tutarı istediğiniz gibi değiştirebilirsiniz.

    // Payment Date (Ödeme Tarihi)
    await newTab.waitForSelector('#id_payment_date', { visible: true, timeout: 5000 });
    await newTab.fill('#id_payment_date', '2025-04-25'); // Tarihi buradan değiştirebilirsiniz.

    // 'Create' butonuna tıkla
    await newTab.click('button:has-text("Create")');
});
