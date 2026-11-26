import { resolve } from 'path';
import { defineConfig, devices } from '@playwright/test';

const FRONT_PORT = 1234; // el CORS del back sólo permite http://localhost:1234
const BACK_PORT = 8080;
const FRONT_URL = `http://localhost:${FRONT_PORT}`;
const BACK_URL = `http://localhost:${BACK_PORT}`;
const isCI = !!process.env.CI;

// El back levanta con H2 en memoria y sin Flyway (igual que sus tests), así la
// suite no depende de Docker ni de Postgres.
const backEnv = {
  SPRING_PROFILES_ACTIVE: 'dev',
  SPRING_DATASOURCE_URL: 'jdbc:h2:mem:sos-e2e',
  SPRING_DATASOURCE_USERNAME: 'sa',
  SPRING_DATASOURCE_PASSWORD: 'sa',
  SPRING_DATASOURCE_DRIVER_CLASS_NAME: 'org.h2.Driver',
  SPRING_FLYWAY_ENABLED: 'false',
  SPRING_JPA_HIBERNATE_DDL_AUTO: 'create-drop',
};

export default defineConfig({
  testDir: resolve(import.meta.dirname, './e2e'),
  outputDir: resolve(import.meta.dirname, './test-results'),
  // Cada test crea sus propios datos con emails únicos, así que pueden correr
  // en paralelo contra la misma instancia del back.
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 2 : undefined,
  reporter: isCI
    ? [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['list']],
  timeout: 30_000,
  expect: { timeout: 7_000 },
  use: {
    baseURL: FRONT_URL,
    locale: 'es-AR',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Localmente se puede usar el Chrome instalado: PW_CHANNEL=chrome
    channel: process.env.PW_CHANNEL || undefined,
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: process.env.PW_CHANNEL || undefined } }],
  webServer: [
    {
      name: 'back',
      command: './gradlew bootRun -x downloadNewrelic -x unzipAndSetUpNewrelic',
      cwd: resolve(import.meta.dirname, '../back'),
      env: backEnv,
      url: `${BACK_URL}/ping`,
      reuseExistingServer: !isCI,
      timeout: 240_000,
      stderr: 'pipe', // si el back no levanta, el motivo queda en el log
    },
    {
      name: 'front',
      command: `npm run dev`,
      cwd: import.meta.dirname,
      env: { VITE_API_URL: BACK_URL },
      url: FRONT_URL,
      reuseExistingServer: !isCI,
      timeout: 60_000,
    },
  ],
});
