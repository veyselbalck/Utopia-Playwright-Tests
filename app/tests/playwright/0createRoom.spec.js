const { test, expect } = require('@playwright/test');
const config = require("./config");

// Yeni borç kaydı oluşturma
test('create room', async ({ page }) => {
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');

     // rooms sayfasına gir
    await page.click('a.app-menu__item:has-text("Rooms")');
    await expect(page).toHaveURL(config.urls.RoomsPage);

    // 'Create' butonuna tıkla
    const createButton = page.locator('button:has-text("Add Room")');

    // Yeni sekme açılacak, önceki tıklamayı bekle
    const [newTab] = await Promise.all([
        page.context().waitForEvent('page'), // Yeni sekme açıldığında bekle
        createButton.click(), // Tıklama işlemi
    ]);

    // Yeni sekme açıldıktan sonra, o sekmeye geçiş yap
    await newTab.waitForLoadState('load'); // Sayfa tamamen yüklendikten sonra geçiş yap

    // Yeni sekmede doğru URL'yi kontrol et
    console.log(await newTab.url()); // Hangi URL'ye yönlendirildiğini görmek için konsola yazdır
    await expect(newTab).toHaveURL(config.urls.CreateRoom);

     // Full name
    await newTab.waitForSelector('#id_name', { visible: true, timeout: 5000 });
    await newTab.fill('#id_name', 'testroom');

    // type name
    await newTab.waitForSelector('#id_type', { visible: true, timeout: 5000 });
    await newTab.fill('#id_type', '0');

     // capacity
    await newTab.waitForSelector('#id_capacity', { visible: true, timeout: 5000 });
    await newTab.fill('#id_capacity', '10');


    await newTab.click('button:has-text("Create")');
    await expect(page).toHaveURL(config.urls.RoomsPage);


});