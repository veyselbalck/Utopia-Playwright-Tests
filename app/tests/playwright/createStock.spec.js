const { test, expect } = require('@playwright/test');
const config = require('./config');

 test('create stock', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // Stok listesine git
    await page.click('a:has-text("Stocks")');
    await page.click('a[href="/stocks/items/"]');
    await expect(page).toHaveURL(config.urls.StockPage);

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
    await expect(newTab).toHaveURL(config.urls.CreateStockPage);

   // Item name
   await newTab.waitForSelector('#id_name', { visible: true, timeout: 5000 });
   await newTab.fill('#id_name', 'John Doe');

   // Description
    await newTab.waitForSelector('#id_description', { visible: true, timeout: 5000 });
    await newTab.fill('#id_description', 'John Doe examinaton description');

    // category seçimi daha yapılmadı
    await newTab.click('#id_category'); // Select2 kutusunu aç
    await newTab.click('#id_category:has-text("Other")'); // Seç

     //suplier seçimi daha yapılmadı
    await newTab.click('.select2-selection'); // Select2 kutusunu aç
    await newTab.click('.select2-results__option:has-text("John Doe")'); // Seç

     //unit
    await newTab.waitForSelector('#id_unit', { visible: true, timeout: 5000 });
    await newTab.fill('#id_unit', '100');

    // threshold
    await newTab.waitForSelector('#id_threshold', { visible: true, timeout: 5000 });
    await newTab.fill('#id_threshold', '100');

    // last purchase price
    await newTab.waitForSelector('#id_last_purchase_price', { visible: true, timeout: 5000 });
    await newTab.fill('#id_last_purchase_price', '100');

    // last purchase date
    await newTab.waitForSelector('#id_last_purchase_date', { visible: true, timeout: 5000 });
    await newTab.fill('#id_last_purchase_date', '1990-01-01');

    // Add new supplier
   await newTab.waitForSelector('#id_new_supplier', { visible: true, timeout: 5000 });
   await newTab.fill('#id_new_supplier', 'John Does');

   await newTab.click('button:has-text("Create")');
   await expect(page).toHaveURL(config.urls.StockPage);

});