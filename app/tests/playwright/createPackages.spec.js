const { test, expect } = require('@playwright/test');
const config = require('./config');

 test('create new package', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // Package listesine git
    await page.click('a:has-text("Packages")');
    await page.click('a[href="/package/"]');
    await expect(page).toHaveURL(config.urls.PackagePage);

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
    await expect(newTab).toHaveURL(config.urls.CreatePackage);

   // Item name
   await newTab.waitForSelector('#id_name', { visible: true, timeout: 5000 });
   await newTab.fill('#id_name', 'John Doe');

   //total Sessions
    await newTab.waitForSelector('#id_total_sessions', { visible: true, timeout: 5000 });
    await newTab.fill('#id_total_sessions', '100');

    //Service  seçimi
     // "Service" dropdown menüsüne tıklayın
  await newTab.click('#id_service_choice');
  // " | None" seçeneğini seçin, value="examinationcatalog-1" olduğu için
  await newTab.selectOption('#id_service_choice', { value: 'examinationcatalog-1' });

   await newTab.click('button:has-text("Create")');
   await expect(page).toHaveURL(config.urls.PackagePage);

});