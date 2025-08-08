const { test, expect } = require('@playwright/test');
const config = require('./config');

 test('create of examinations', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // examinations a git
     await page.click('a:has-text("Catalogs")');
     await page.waitForSelector('a[href="/catalogs/courses/"]', { state: 'visible' });
     await page.click('a[href="/catalogs/courses/"]');

    await expect(page).toHaveURL(config.urls.CatalogCourse);


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
    await expect(newTab).toHaveURL(config.urls.CreateCatalogCourses);



        // Course name
    await newTab.waitForSelector('#id_course_name', { visible: true, timeout: 5000 });
    await newTab.fill('#id_course_name', 'John Doe');

    // Price (Tutar)
       await newTab.waitForSelector('#id_price', { visible: true, timeout: 5000 });
       await newTab.fill('#id_price', '100');

       // Specialist seçimi
       await newTab.click('.select2-selection'); // Select2 kutusunu aç
       await newTab.fill('.select2-search__field', 'John Doe'); // Arama kutusuna yaz
       await newTab.waitForSelector('.select2-results__option', { timeout: 5000 }); // Sonuç gelsin
       await newTab.click('.select2-results__option:has-text("John Doe")'); // Seç

  //course  description
    await newTab.waitForSelector('#id_description', { visible: true, timeout: 5000 });
    await newTab.fill('#id_description', 'John Doe course description');

    // Product Code
    await newTab.waitForSelector('#id_product_code', { visible: true, timeout: 5000 });
    await newTab.fill('#id_product_code', '100');

   await newTab.click('button:has-text("Create")');
    await expect(page).toHaveURL(config.urls.CatalogCourse);


 });