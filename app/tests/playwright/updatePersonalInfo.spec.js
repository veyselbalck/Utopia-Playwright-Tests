const { test, expect } = require('@playwright/test');
const config = require("./config");


test('update personalinfo', async ({ page }) => {

    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);


  // Profil menüsünü aç (kullanıcı ikonuna tıkla)
  await page.click('a.app-nav__item[aria-label="Open Profile Menu"]');

  // Dropdown içindeki "Profile" bağlantısına tıkla
  await page.click('a.dropdown-item[href="/accounts/me/view/"]');


  // İşlemi görmek için bir süre bekleyin
  await page.waitForTimeout(3000); // 3 saniye bekle (gerekirse arttırabilirsiniz)

    // Sayfayı bekle ve URL'yi kontrol et
    await expect(page).toHaveURL(config.urls.PersonalInfo);
 // Şimdi "Edit" butonuna tıklama
    await page.click('a[href="/accounts/me/edit/"].float-right.btn.btn-secondary');

    // Yeni sayfanın URL'sinin doğru olduğuna emin ol
    await expect(page).toHaveURL(config.urls.EditPersonalInfo);

     await page.waitForSelector('form#user-form');

    // Görsel dosyasının yolu
  const imagePath = 'app/tests/playwright/test_images/profile-pic.jpg'; // Örneğin: './uploads/test.jpg'
  // Dosya input'una dosyayı yükle
  await page.setInputFiles('#id_profile_picture', imagePath);

    // Tam Adı gir
    await page.fill('#id_full_name', 'john doe');

    // Telefon numarasını gir
    await page.fill('#id_phone_number', '555-555-5555');

    // Doğum tarihini gir (Tarihi doğru formatta giriyoruz)
    await page.fill('#id_birth_date', '1990-01-01');

    // E-posta adresini gir
    await page.fill('#id_email', 'johndoe@gmail.com');

    // Meslek bilgisini gir
    await page.fill('#id_profession', 'Software Developer');

    // Formu gönder
    await page.click('button.btn-success[form="user-form"]');
    await page.waitForLoadState('networkidle');



});
