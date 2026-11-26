import { test, expect } from './support/fixtures.js';
import { PASSWORD, uniqueEmail } from './support/api.js';

test.describe('Visitante y retorno al open space', () => {
  test('un visitante ve el open space público sin tablero de control', async ({
    page,
    openSpace,
  }) => {
    await page.goto(`/os/${openSpace.id}`);
    await expect(page.getByRole('heading', { name: openSpace.name })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Tablero de control' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Proponé una charla!' })).toBeVisible();
  });

  test('"Proponé una charla!" lleva a login y, tras ingresar, vuelve al open space', async ({
    page,
    speaker,
    openSpace,
  }) => {
    await page.goto(`/os/${openSpace.id}`);
    await page.getByRole('button', { name: 'Proponé una charla!' }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.locator('input[type="email"]').fill(speaker.email);
    await page.locator('input[type="password"]').fill(speaker.password);
    await page.getByRole('button', { name: 'Ingresar' }).last().click();

    await expect(page).toHaveURL(`/os/${openSpace.id}`);
    await expect(page.getByRole('button', { name: 'Mis charlas' })).toBeVisible();
  });

  test('desde ese login, "Registrarse" conserva el destino y vuelve al open space', async ({
    page,
    openSpace,
  }) => {
    await page.goto(`/os/${openSpace.id}`);
    await page.getByRole('button', { name: 'Proponé una charla!' }).click();
    await page.getByRole('button', { name: 'Registrarse' }).click();
    await expect(page).toHaveURL(/\/register$/);

    await page.locator('input[name="name"]').fill('Visitante Nuevo');
    await page.locator('input[type="email"]').fill(uniqueEmail('visitante'));
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await page.locator('input[type="password"]').last().fill(PASSWORD);
    await page.getByRole('button', { name: 'Registrarme' }).click();

    await expect(page).toHaveURL(`/os/${openSpace.id}`);
  });
});

test.describe('Rutas protegidas', () => {
  for (const [descripcion, ruta] of [
    ['alta de open space', () => '/new'],
    ['mis charlas', (os) => `/os/${os.id}/myTalks`],
    ['edición de open space', (os) => `/os/${os.id}/edit`],
  ]) {
    test(`sin sesión, ${descripcion} redirige al login`, async ({ page, openSpace }) => {
      await page.goto(ruta(openSpace));
      await expect(page).toHaveURL(/\/login$/);
    });
  }
});

test.describe('Errores de la API', () => {
  test('un error del back se muestra en un toast arriba al centro con el mensaje recibido', async ({
    page,
    login,
    speaker,
  }) => {
    await page.route('**/openSpace/user/**', (route) =>
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Falló algo en el back' }),
      })
    );
    await login(speaker);
    await page.goto('/');

    const toast = page.locator('.Toastify__toast--error');
    await expect(toast).toContainText('Falló algo en el back');
    await expect(page.locator('.Toastify__toast-container--top-center')).toBeVisible();
  });
});
