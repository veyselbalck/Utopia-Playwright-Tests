const { test, expect } = require('@playwright/test');
const config = require('./config');

 test('create new patients package', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // Package listesine git
    await page.click('a:has-text("Packages")');
    await page.click('a[href="/package/patient-packages/"]');
    await expect(page).toHaveURL(config.urls.PatientPackagePage);

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
    await expect(newTab).toHaveURL(config.urls.CreatePatientPackage);


        //from
       // Select2 kutusunu aç
    await newTab.click('#select2-id_patient-container');
    await newTab.waitForSelector('.select2-results__option'); // Açılan seçenekleri bekle
    await newTab.click('li.select2-results__option:has-text("2000-01-01: John Doe")');

    //select package
    await newTab.click('#select2-id_package-container');
    await newTab.waitForSelector('.select2-results__option'); // Açılan seçenekleri bekle
    await newTab.click('li.select2-results__option:has-text("JOHN DOE (100 sessions)")');

   // date
     await newTab.waitForSelector('#id_start_date', { visible: true, timeout: 5000 });
  await newTab.fill('#id_start_date', '1990-01-01');

   //status
    await newTab.click('#id_status');
    await newTab.click('#id_status:has-text("Paused")');

   await newTab.click('button:has-text("Create")');
   await expect(page).toHaveURL(config.urls.PatientPackagePage);

});