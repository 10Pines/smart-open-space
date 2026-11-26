import { test, expect } from './support/fixtures.js';
import { PASSWORD, uniqueEmail } from './support/api.js';

test.describe('Autenticación', () => {
  test('sin sesión, la raíz redirige a /login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Iniciar sesión' })).toBeVisible();
  });

  test('el registro crea la cuenta y lleva al home', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Registrarse' }).click();
    await expect(page).toHaveURL(/\/register$/);

    await page.locator('input[name="name"]').fill('Persona Nueva');
    await page.locator('input[type="email"]').fill(uniqueEmail('registro'));
    await page.locator('input[type="password"]').first().fill(PASSWORD);
    await page.locator('input[type="password"]').last().fill(PASSWORD);
    await page.getByRole('button', { name: 'Registrarme' }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Mis Open Spaces' })).toBeVisible();
    await expect(page.getByText('Persona Nueva')).toBeVisible();
  });

  test('el login con credenciales válidas lleva al home', async ({ page, speaker }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(speaker.email);
    await page.locator('input[type="password"]').fill(speaker.password);
    await page.getByRole('button', { name: 'Ingresar' }).last().click();

    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { name: 'Mis Open Spaces' })).toBeVisible();
  });

  test('el login con una clave incorrecta muestra el error de la API en un toast', async ({
    page,
    speaker,
  }) => {
    await page.goto('/login');
    await page.locator('input[type="email"]').fill(speaker.email);
    await page.locator('input[type="password"]').fill('clave-incorrecta');
    await page.getByRole('button', { name: 'Ingresar' }).last().click();

    await expect(page.locator('.Toastify__toast--error')).toContainText(/inválid|invalid|incorrect/i);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('con la sesión iniciada, /login redirige al home', async ({ page, login, speaker }) => {
    await login(speaker);
    await page.goto('/login');
    await expect(page).toHaveURL('/');
  });

  test.describe('recuperación de contraseña', () => {
    test('/recovery-email muestra el formulario', async ({ page }) => {
      await page.goto('/login');
      await page.getByText('Olvidaste tu contraseña?').click();
      await expect(page).toHaveURL(/\/recovery-email$/);
      await expect(page.getByRole('heading', { name: 'Restablecer contraseña' })).toBeVisible();
    });

    test('/reset-password muestra el formulario con email y token en la URL', async ({ page }) => {
      await page.goto('/reset-password?email=a@b.com&token=xyz');
      await expect(page).toHaveURL(/\/reset-password\?email=a@b.com&token=xyz$/);
      await expect(page.getByRole('heading', { name: 'Restablecer contraseña' })).toBeVisible();
    });

    test('/login?reset=1 redirige a /reset-password conservando email y token', async ({ page }) => {
      await page.goto('/login?reset=1&email=a@b.com&token=xyz');
      await expect(page).toHaveURL(/\/reset-password\?email=a@b.com&token=xyz$/);
    });
  });

  test('una ruta inexistente no rompe la app: sigue el layout con el header', async ({ page }) => {
    await page.goto('/ruta-inexistente');
    await expect(page.getByText('Smart Open Spaces').first()).toBeVisible();
  });
});
