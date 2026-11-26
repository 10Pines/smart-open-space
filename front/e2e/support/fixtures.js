import { test as base, expect } from '@playwright/test';
import { BackApi, loginAs } from './api.js';

export const test = base.extend({
  api: async ({ playwright }, use) => {
    const request = await playwright.request.newContext();
    await use(new BackApi(request));
    await request.dispose();
  },

  organizer: async ({ api }, use) => use(await api.registerUser('Organizadora E2E')),

  speaker: async ({ api }, use) => use(await api.registerUser('Speaker E2E')),

  /** Open space con un eje, dos salas y dos slots, creado por `organizer`. */
  openSpace: async ({ api, organizer }, use) => use(await api.createOpenSpace(organizer)),

  /** Función para iniciar sesión en el navegador como un usuario ya registrado. */
  login: async ({ page }, use) => use((user) => loginAs(page, user)),
});

export { expect };

/** Switch (react-switch) del tablero de control, identificado por su texto. */
export const switchFor = (page, label) =>
  page.getByText(label, { exact: true }).locator('xpath=..').getByRole('switch');

/** Cambia el estado de un switch haciendo click en su parte visible (el input está oculto). */
export const toggleSwitch = (page, label) =>
  page.getByText(label, { exact: true }).locator('xpath=..').locator('.react-switch-bg').click();
