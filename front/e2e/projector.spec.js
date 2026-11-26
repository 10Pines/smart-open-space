import { test, expect, switchFor, toggleSwitch } from './support/fixtures.js';

test.describe('Marketplace y proyector', () => {
  test.beforeEach(async ({ api, login, organizer, speaker, openSpace }) => {
    await api.toggleCallForPapers(organizer, openSpace.id);
    await login(organizer);
  });

  test('sin charlas encoladas el proyector muestra el estado vacío y permite volver', async ({
    page,
    openSpace,
  }) => {
    await page.goto(`/os/${openSpace.id}/projector`);
    await expect(page.getByText('No hay oradores para exponer')).toBeVisible();

    await page.getByRole('button', { name: 'Ir al OpenSpace' }).click();
    await expect(page).toHaveURL(`/os/${openSpace.id}`);
  });

  test('abrir el marketplace desde el tablero habilita el acceso al proyector', async ({
    page,
    openSpace,
  }) => {
    await page.goto(`/os/${openSpace.id}`);
    await expect(page.getByRole('button', { name: 'Abrir proyector' })).toHaveCount(0);

    await toggleSwitch(page, 'Marketplace abierto');
    await expect(switchFor(page, 'Marketplace abierto')).toBeChecked();

    await expect(page.getByRole('button', { name: 'Abrir proyector' })).toBeVisible();
  });

  test('el botón del proyector del tablero recibe clicks y abre el proyector', async ({
    page,
    openSpace,
  }) => {
    await page.goto(`/os/${openSpace.id}`);
    await toggleSwitch(page, 'Marketplace abierto');

    await page.getByRole('button', { name: 'Abrir proyector' }).click();
    await expect(page).toHaveURL(`/os/${openSpace.id}/projector`);
  });

  test('muestra la charla encolada, corre el contador de 30" y pasa a la siguiente', async ({
    page,
    api,
    organizer,
    speaker,
    openSpace,
  }) => {
    const talk = await api.createTalk(speaker, openSpace.id, { name: 'Charla en el proyector' });
    await api.activateQueue(organizer, openSpace.id);
    await api.enqueueTalk(speaker, talk.id);

    await page.goto(`/os/${openSpace.id}/projector`);
    await expect(page.getByRole('heading', { name: 'Charla en el proyector' })).toBeVisible();
    await expect(page.getByText('Descripción de Charla en el proyector')).toBeVisible();
    await expect(page.getByText(speaker.name)).toBeVisible();
    await expect(page.getByText('Último orador!')).toBeVisible();

    await page.getByRole('button', { name: "30''" }).click();
    await expect(page.getByText('TIEMPO RESTANTE')).toBeVisible();
    await expect(page.getByText(/^(29|28|27)$/)).toBeVisible();

    await page.getByRole('button', { name: 'Siguiente' }).click();
    await expect(page.getByText('No hay oradores para exponer')).toBeVisible();
  });

  test('una charla encolada mientras el proyector está abierto aparece sin recargar (socket)', async ({
    page,
    api,
    organizer,
    speaker,
    openSpace,
  }) => {
    const talk = await api.createTalk(speaker, openSpace.id, { name: 'Charla en vivo' });
    await api.activateQueue(organizer, openSpace.id);

    await page.goto(`/os/${openSpace.id}/projector`);
    await expect(page.getByText('No hay oradores para exponer')).toBeVisible();

    await api.enqueueTalk(speaker, talk.id);
    await expect(page.getByRole('heading', { name: 'Charla en vivo' })).toBeVisible();
  });
});
