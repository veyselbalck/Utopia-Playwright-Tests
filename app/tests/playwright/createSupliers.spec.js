const { test, expect } = require('@playwright/test');
const config = require('./config');

 test('display of stock supliers', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // Stok supliers listesi
    await page.click('a:has-text("Stocks")');
    await page.click('a[href="/stocks/suppliers/"]');
    await expect(page).toHaveURL(config.urls.StockSupliers);

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
    await expect(newTab).toHaveURL(config.urls.CreateStockSuplier);

    // Supplier name
   await newTab.waitForSelector('#id_name', { visible: true, timeout: 5000 });
   await newTab.fill('#id_name', 'John Doe');

     // Contactinfo
   await newTab.waitForSelector('#id_name', { visible: true, timeout: 5000 });
   await newTab.fill('#id_contact_info', 'my.contact@example.com');

   await newTab.click('button:has-text("Create")');


});