const { test, expect } = require('@playwright/test');
const config = require("./config");

// Yeni borç kaydı oluşturma
test('create transaction category', async ({ page }) => {
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');

     // transaction category sayfasına gir
    await page.click('a.app-menu__item:has-text("Transaction Category")');
    await expect(page).toHaveURL(config.urls.TransactionCategoryPage);

    // 'Create' butonuna tıkla
    const createButton = page.locator('button:has-text("Add Category")');

    // Yeni sekme açılacak, önceki tıklamayı bekle
    const [newTab] = await Promise.all([
        page.context().waitForEvent('page'), // Yeni sekme açıldığında bekle
        createButton.click(), // Tıklama işlemi
    ]);

    // Yeni sekme açıldıktan sonra, o sekmeye geçiş yap
    await newTab.waitForLoadState('load'); // Sayfa tamamen yüklendikten sonra geçiş yap

    // Yeni sekmede doğru URL'yi kontrol et
    console.log(await newTab.url()); // Hangi URL'ye yönlendirildiğini görmek için konsola yazdır
    await expect(newTab).toHaveURL(config.urls.CreateTransactionCategory);

     // Full name
    await newTab.waitForSelector('#id_name', { visible: true, timeout: 5000 });
    await newTab.fill('#id_name', 'Testcategory');

     // transactions type  seçimi daha yapılmadı
    await newTab.click('#id_category'); // Select2 kutusunu aç
    await newTab.click('#id_category:has-text("Other")'); // Seç

    await newTab.click('button:has-text("Create")');
    await expect(page).toHaveURL(config.urls.TransactionCategoryPage);


});