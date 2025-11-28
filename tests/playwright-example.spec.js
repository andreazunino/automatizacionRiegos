// Ejemplo simple de Playwright Test sin depender de red externa
const { test, expect } = require('@playwright/test');

test('home muestra titulo Playwright', async ({ page }) => {
  await page.setContent(`
    <header>
      <div class="navbar__title">Playwright Docs</div>
    </header>
  `);
  const title = await page.innerText('header .navbar__title');
  expect(title).toContain('Playwright');
});

// Ejemplo de flujo con buscador simulado
test('busqueda en docs', async ({ page }) => {
  test.setTimeout(30_000);
  await page.setContent(`
    <main>
      <input aria-label="Search docs" placeholder="Search docs" />
      <div id="results"></div>
    </main>
    <script>
      const input = document.querySelector('input');
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          document.getElementById('results').innerText = 'Trace viewer guide';
        }
      });
    </script>
  `);

  await page.getByPlaceholder('Search docs').click();
  await page.getByPlaceholder('Search docs').fill('trace');
  await page.keyboard.press('Enter');
  const results = page.locator('#results');
  await expect(results).toContainText('Trace viewer');
});
