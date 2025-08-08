const { test, expect } = require('@playwright/test');
const config = require('./config');

 test('Etkinlik listesi görüntüleme', async ({ page }) => {
    // Admin paneline giriş yap
    await page.goto(config.urls.loginPage);
    await page.fill('#id_email', config.credentials.email);
    await page.fill('#id_password', config.credentials.password);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(config.urls.dashboardPage);

    // Etkinlik listesine git
    await page.click('a.app-menu__item:has-text("Events")');
    await expect(page).toHaveURL(config.urls.EventPage);


    // Wait for the table to load completely (adjust the selector accordingly)
  await page.waitForSelector('.table-hover');

  // Get all the event titles from the table
  const eventTitles = await page.$$eval('table tbody tr td:nth-child(2)', (rows) => {
    return rows.map(row => row.innerText.trim());
  });

  // Check if the event titles are sorted in ascending order
  const isSortedAscending = eventTitles.every((title, i, arr) => i === 0 || arr[i - 1] <= title);

  // Check the result
  expect(isSortedAscending).toBe(true);  // Expecting it to be sorted in ascending order

});
