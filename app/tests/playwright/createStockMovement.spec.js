const { test, expect } = require('@playwright/test');
const config = require('./config');

test('Create stock movement', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // Stok movement  git
    await page.click('a:has-text("Stocks")');
    await page.click('a[href="/stocks/movements/"]');
    await expect(page).toHaveURL(config.urls.StockMovementPage);

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
    await expect(newTab).toHaveURL(config.urls.CreateStockMovement);

       // stock item seçimi daha yapılmadı
    await newTab.click('#id_stock_item'); // Select2 kutusunu aç
    await newTab.click('#id_stock_item:has-text("asd")'); // Seç

    // movement type
    await newTab.click('#id_movement_type'); // Select2 kutusunu aç
    await newTab.click('#id_movement_type:has-text("Loss")'); // Seç

    // quantity
    await newTab.waitForSelector('#id_quantity', { visible: true, timeout: 5000 });
    await newTab.fill('#id_quantity', '100');

    //suplier seçimi
    await newTab.selectOption('#id_supplier', { label: 'JOHN DOE' });

    // last purchase price
    await newTab.waitForSelector('#id_price', { visible: true, timeout: 5000 });
    await newTab.fill('#id_price', '100');

    // reason
    await newTab.waitForSelector('#id_reason', { visible: true, timeout: 5000 });
    await newTab.fill('#id_reason', 'John Doe stock movement reason');

    await newTab.click('button:has-text("Create")');
    await expect(page).toHaveURL(config.urls.StockMovementPage);

});