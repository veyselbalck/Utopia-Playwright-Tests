const { test, expect } = require('@playwright/test');
const config = require("./config");



test('transaction listesi görüntüleme', async ({ page }) => {
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // transactions listesine git
    await page.click('a.app-menu__item:has-text("Transactions")');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(config.urls.TransactionsPage);

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
    await expect(newTab).toHaveURL(config.urls.CreateTransactions);

  // Transaction name
    await newTab.waitForSelector('#id_full_name', { visible: true, timeout: 5000 });
    await newTab.fill('#id_full_name', 'John Doe');

    // ammount
    await newTab.waitForSelector('#id_amount', { visible: true, timeout: 5000 });
    await newTab.fill('#id_amount', '100');

    // transactions type  seçimi daha yapılmadı
    await newTab.click('#id_transaction_type'); // Select2 kutusunu aç
    await newTab.click('#id_transaction_type:has-text("Debit")'); // Seç

     // source name
    await newTab.waitForSelector('#id_source', { visible: true, timeout: 5000 });
    await newTab.fill('#id_source', 'John Doe');

     // notes
    await newTab.waitForSelector('#id_notes', { visible: true, timeout: 5000 });
    await newTab.fill('#id_notes', 'John Doe examinaton description');

     // service name
    await newTab.waitForSelector('#id_service', { visible: true, timeout: 5000 });
    await newTab.fill('#id_service', 'John Doe');

    // category seçimi daha yapılmadı
    await newTab.click('#id_category'); // Select2 kutusunu aç
    await newTab.click('#id_category:has-text("Testcategory (other)")'); // Seç


    await newTab.click('button:has-text("Create")');
    await expect(page).toHaveURL(config.urls.TransactionsPage);


});