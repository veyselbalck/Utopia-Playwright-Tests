const { test, expect } = require('@playwright/test');
const config = require('./config');

test('Hasta ekleme sırasında zorunlu alanlar kontrolü', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // Hasta ekleme sayfasına git
    await page.click('a.app-menu__item:has-text("Patients")');
    await expect(page).toHaveURL(config.urls.PatientPage);

    // 'Create' butonuna tıkla
const createButton = page.locator('button:has-text("Create")');

// Yeni sekme açılacak, önceki tıklamayı bekle
const [newTab] = await Promise.all([
  page.context().waitForEvent('page'), // Yeni sekme açıldığında bekle
  createButton.click(), // Tıklama işlemi
]);

// Yeni sekme açıldıktan sonra, o sekmeye geçiş yap
await newTab.waitForLoadState(); // Yeni sekme tamamen yüklenene kadar bekle

// Yeni sekmede doğru URL'yi kontrol et
await expect(newTab).toHaveURL(config.urls.AddPatient);

// Yeni sekme açıldıktan sonra, sayfanın tamamen yüklenmesini bekle
await newTab.waitForLoadState('load', { timeout: 10000 });

// Form alanlarını doldurmadan önce her bir öğenin görünür olmasını bekleyelim

// Full name
await newTab.waitForSelector('#id_full_name', { visible: true, timeout: 5000 });
await newTab.fill('#id_full_name', 'John Doe');

// Birth date
await newTab.waitForSelector('#id_birth_date', { visible: true, timeout: 5000 });
await newTab.fill('#id_birth_date', '1990-01-01');

// Gender
await newTab.waitForSelector('#id_gender', { visible: true, timeout: 5000 });
await newTab.selectOption('#id_gender', 'male');

// Blood Type
await newTab.waitForSelector('#id_blood_type', { visible: true, timeout: 5000 });
await newTab.selectOption('#id_blood_type', 'A Rh +');

// Profession
await newTab.waitForSelector('#id_profession', { visible: true, timeout: 5000 });
await newTab.fill('#id_profession', 'Engineer');

// Weight
await newTab.waitForSelector('#id_weight', { visible: true, timeout: 5000 });
await newTab.fill('#id_weight', '75');

// Height
await newTab.waitForSelector('#id_height', { visible: true, timeout: 5000 });
await newTab.fill('#id_height', '180');

// Email
await newTab.waitForSelector('#id_email', { visible: true, timeout: 5000 });
await newTab.fill('#id_email', 'john.doe@example.com');

// Identity Document
await newTab.waitForSelector('#id_identity_document', { visible: true, timeout: 5000 });
await newTab.fill('#id_identity_document', '123456789');

// Address
await newTab.waitForSelector('#id_address', { visible: true, timeout: 5000 });
await newTab.fill('#id_address', '123 Main St, New York');

// Phone Number
await newTab.waitForSelector('#id_phone_number', { visible: true, timeout: 5000 });
await newTab.fill('#id_phone_number', '5551234567');

// Source
 await newTab.waitForSelector('#id_source', { visible: true, timeout: 5000 });
 await newTab.fill('#id_source', 'Online Ads');

  // Submit butonuna tıkla
// 'Submit' butonunun görünür olup olmadığını kontrol et

// Butona tıkla
 await page.click('button:has-text("Submıt")');
 // dikkat: "Submıt" Türkçe klavye ile yazılmış olabilir, "Submit" değilse formdaki metni kontrol et

  // Liste sayfasına yönlendirme kontrolü
  await expect(page).toHaveURL(config.urls.PatientPage);

    // Hata mesajlarını kontrol et
    await expect(page.locator('.error-message')).toHaveText('Bu alan zorunludur.');
});

