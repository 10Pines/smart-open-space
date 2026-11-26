import { test, expect, switchFor, toggleSwitch } from './support/fixtures.js';
import { loginAs } from './support/api.js';

test.describe('Open space (organizador)', () => {
  test.beforeEach(async ({ login, organizer }) => {
    await login(organizer);
  });

  test('el home lista el open space y permite abrirlo', async ({ page, openSpace }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Mis Open Spaces' })).toBeVisible();

    await page.getByText(openSpace.name).click();

    await expect(page).toHaveURL(`/os/${openSpace.id}`);
    await expect(page.getByRole('heading', { name: 'Tablero de control' })).toBeVisible();
    await expect(page.getByRole('heading', { name: openSpace.name })).toBeVisible();
  });

  test('un usuario sin open spaces ve el estado vacío del home', async ({ page, api }) => {
    const nuevo = await api.registerUser('Sin Open Spaces');
    await loginAs(page, nuevo);

    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Cargar OpenSpace' })).toBeVisible();
  });

  test('abrir y cerrar la convocatoria avisa y persiste tras recargar', async ({ page, openSpace }) => {
    await page.goto(`/os/${openSpace.id}`);
    const convocatoria = switchFor(page, 'Convocatoria de charlas abierta');
    await expect(convocatoria).not.toBeChecked();

    await toggleSwitch(page, 'Convocatoria de charlas abierta');
    await expect(page.getByRole('status').getByText('Convocatoria abierta para proponer charlas')).toBeVisible();
    await expect(convocatoria).toBeChecked();

    await page.reload();
    await expect(switchFor(page, 'Convocatoria de charlas abierta')).toBeChecked();
  });

  test('"Editar" abre la edición y "Cancelar" vuelve a la pantalla anterior', async ({
    page,
    openSpace,
  }) => {
    await page.goto(`/os/${openSpace.id}`);

    await page.getByRole('button', { name: 'Editar open space' }).click();
    await expect(page).toHaveURL(`/os/${openSpace.id}/edit`);
    await expect(page.getByRole('heading', { name: 'Editar Open Space' })).toBeVisible();

    await page.getByText('Cancelar', { exact: true }).click();
    await expect(page).toHaveURL(`/os/${openSpace.id}`);
  });

  test('"Nuevo" abre el alta de open space y "Cancelar" vuelve al home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Cargar OpenSpace' }).click();
    await expect(page).toHaveURL('/new');
    await expect(page.getByRole('heading', { name: 'Nuevo Open Space' })).toBeVisible();

    await page.getByText('Cancelar', { exact: true }).click();
    await expect(page).toHaveURL('/');
  });

  test('"Agenda" lleva a la grilla horaria del open space', async ({ page, openSpace }) => {
    await page.goto(`/os/${openSpace.id}`);
    await page.getByRole('button', { name: 'Agenda' }).click();

    await expect(page).toHaveURL(`/os/${openSpace.id}/schedule`);
    await expect(page.getByText('10:00 hs (inicio)')).toBeVisible();
    await expect(page.getByText('12:00 hs (fin)')).toBeVisible();
  });
});

test.describe('Páginas estáticas', () => {
  test('el manual se muestra sin necesidad de sesión', async ({ page }) => {
    await page.goto('/manual');
    await expect(page.getByRole('heading', { name: 'Manual del Smart Open Space' })).toBeVisible();
  });

  test('el design system se muestra sin necesidad de sesión', async ({ page }) => {
    await page.goto('/design-system');
    await expect(page.getByRole('heading', { name: 'Design System' })).toBeVisible();
  });
});
