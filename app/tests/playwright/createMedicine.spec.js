const { test, expect } = require('@playwright/test');
const config = require("./config");



test('create medicine', async ({ page }) => {
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // medicine listesine git
    await page.click('a.app-menu__item:has-text("Medicine")');
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(config.urls.Medicine);

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
    await expect(newTab).toHaveURL(config.urls.CreateMedicine);

  // code
    await newTab.waitForSelector('#id_code', { visible: true, timeout: 5000 });
    await newTab.fill('#id_code', '01');


   // Görsel dosyasının yolu
  const imagePath = 'app/tests/playwright/test_images/profile-pic.jpg'; // Örneğin: './uploads/test.jpg'
  // Dosya input'una dosyayı yükle
  await newTab.setInputFiles('#id_image', imagePath);

     // medicine name
    await newTab.waitForSelector('#id_name', { visible: true, timeout: 5000 });
    await newTab.fill('#id_name', '01');


     // descriptions
    await newTab.waitForSelector('#id_description', { visible: true, timeout: 5000 });
    await newTab.fill('#id_description', 'John Doe medicine description');


    await newTab.click('button:has-text("Create")');
    await expect(page).toHaveURL(config.urls.Medicine);


});