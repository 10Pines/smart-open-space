import { test, expect } from './support/fixtures.js';

const elegirOpcion = async (page, textoOpcion) => {
  await page.getByRole('option', { name: textoOpcion }).click();
};

test.describe('Charlas (speaker)', () => {
  test.beforeEach(async ({ api, login, organizer, speaker, openSpace }) => {
    await api.toggleCallForPapers(organizer, openSpace.id); // convocatoria abierta
    await login(speaker);
  });

  test('"Cargar charla" abre el formulario y "Cancelar" vuelve a mis charlas', async ({
    page,
    openSpace,
  }) => {
    await page.goto(`/os/${openSpace.id}/myTalks`);
    await page.getByRole('button', { name: 'Cargar charla' }).click();
    await expect(page).toHaveURL(`/newTalk/${openSpace.id}`);

    await page.getByRole('button', { name: 'Cancelar' }).click();
    await expect(page).toHaveURL(`/os/${openSpace.id}/myTalks`);
  });

  test('crear una charla la muestra en mis charlas', async ({ page, openSpace }) => {
    await page.goto(`/newTalk/${openSpace.id}`);

    await page.getByText('Seleccionar eje temático').click();
    await elegirOpcion(page, 'Técnica');
    await page.locator('input[name="name"]').fill('Mi primera charla');
    await page.locator('textarea[name="description"]').fill('Una descripción');
    await page.getByRole('button', { name: 'Crear' }).click();

    await expect(page).toHaveURL(`/os/${openSpace.id}/myTalks`);
    await expect(page.getByText('Mi primera charla')).toBeVisible();
  });

  test('el eje temático es obligatorio cuando el open space tiene ejes', async ({
    page,
    openSpace,
  }) => {
    await page.goto(`/newTalk/${openSpace.id}`);
    await page.locator('input[name="name"]').fill('Sin eje');
    await page.locator('textarea[name="description"]').fill('Descripción');
    await page.getByRole('button', { name: 'Crear' }).click();

    await expect(page.getByText('Obligatorio')).toBeVisible();
    await expect(page).toHaveURL(`/newTalk/${openSpace.id}`);
  });

  test('el detalle de una charla se abre desde mis charlas y "Volver" regresa', async ({
    page,
    api,
    speaker,
    openSpace,
  }) => {
    const talk = await api.createTalk(speaker, openSpace.id, { name: 'Charla con detalle' });

    await page.goto(`/os/${openSpace.id}/myTalks`);
    await page.getByText('Charla con detalle').click();
    await expect(page).toHaveURL(`/os/${openSpace.id}/talk/${talk.id}`);
    await expect(page.getByRole('heading', { name: 'Charla con detalle' })).toBeVisible();
    await expect(page.getByText('Descripción de Charla con detalle')).toBeVisible();

    await page.getByRole('button', { name: 'Volver' }).click();
    await expect(page).toHaveURL(`/os/${openSpace.id}/myTalks`);
  });

  test('editar una charla desde su detalle guarda el cambio', async ({
    page,
    api,
    speaker,
    openSpace,
  }) => {
    const talk = await api.createTalk(speaker, openSpace.id, { name: 'Título original' });

    await page.goto(`/os/${openSpace.id}/talk/${talk.id}`);
    await page.getByRole('button', { name: 'Editar' }).click();
    await expect(page).toHaveURL(`/os/${openSpace.id}/editTalk/${talk.id}`);

    await page.locator('input[name="name"]').fill('Título editado');
    await page.getByRole('button', { name: 'Crear' }).click();

    await expect(page).toHaveURL(`/os/${openSpace.id}/myTalks`);
    await expect(page.getByText('Título editado')).toBeVisible();
  });
});

test.describe('Agenda (organizador)', () => {
  test('agendar una charla la asigna a sala y horario y la muestra en la agenda', async ({
    page,
    api,
    login,
    organizer,
    speaker,
    openSpace,
  }) => {
    await api.toggleCallForPapers(organizer, openSpace.id);
    await api.createTalk(speaker, openSpace.id, { name: 'Charla a agendar' });
    await login(organizer);

    await page.goto(`/os/${openSpace.id}/myTalks`);
    await page.getByRole('button', { name: /Agendar/ }).click();

    await expect(page.getByText('Agendate!')).toBeVisible();
    await page.getByRole('button', { name: /Open Drop/ }).first().click();
    await elegirOpcion(page, 'Sala 1');
    await page.getByRole('button', { name: /Open Drop/ }).last().click();
    await elegirOpcion(page, '10:00');
    await page.getByRole('button', { name: 'Aceptar' }).click();
    await expect(page.getByText('Agendate!')).toBeHidden();

    await expect(page.getByText('Sala 1')).toBeVisible();
    await expect(page.getByText(/10:00\s?hs/)).toBeVisible();

    await page.goto(`/os/${openSpace.id}/schedule`);
    await expect(page.getByText('Charla a agendar')).toBeVisible();
  });
});
