const { test, expect } = require('@playwright/test');
const config = require("./config");


test('create doctor', async ({ page }) => {
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // doktor listesine git
    await page.click('a.app-menu__item:has-text("Doctors")');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(config.urls.DoctorsPage);

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
    await expect(newTab).toHaveURL(config.urls.CreateDoctor);

        // Full name
    await newTab.waitForSelector('#id_full_name', { visible: true, timeout: 5000 });
    await newTab.fill('#id_full_name', 'John Doe');

     // OCCUPATİON
    await newTab.waitForSelector('#id_occupation', { visible: true, timeout: 5000 });
    await newTab.fill('#id_occupation', 'John Doe');

    // Email
    await newTab.waitForSelector('#id_email', { visible: true, timeout: 5000 });
    await newTab.fill('#id_email', 'john.doe@example.com');

        // Phone Number
    await newTab.waitForSelector('#id_phone_number', { visible: true, timeout: 5000 });
    await newTab.fill('#id_phone_number', '5551234567');

     await newTab.click('button:has-text("Create")');
     await expect(page).toHaveURL(config.urls.DoctorsPage);



});








