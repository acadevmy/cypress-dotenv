import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import type { DotenvRunOptions } from '@dotenv-run/core';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  defineConfigWithDotenv,
  dotenvComponentPreset,
  dotenvE2EPreset,
} from '../src';

type SetupNodeEvents = (
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) => Promise<Cypress.PluginConfigOptions>;

const API_URL = 'https://api.local';
const on = vi.fn() as unknown as Cypress.PluginEvents;
const pluginConfig = (): Cypress.PluginConfigOptions =>
  ({ env: { EXISTING: 'value' } }) as unknown as Cypress.PluginConfigOptions;
const passThrough = vi.fn(
  (_: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => config,
);

let root: string;
const dotenv = (): DotenvRunOptions => ({ prefix: 'MY_APP_', root, cwd: root });

// Prefixed variables are added to the existing ones, the others are left out.
// dotenv-run always adds NODE_ENV.
const EXPECTED_ENV = {
  EXISTING: 'value',
  MY_APP_API_URL: API_URL,
  NODE_ENV: process.env.NODE_ENV,
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'cypress-dotenv-'));
  writeFileSync(
    join(root, '.env'),
    `MY_APP_API_URL=${API_URL}\nOTHER_SECRET=nope\n`,
  );
});

afterEach(() => {
  rmSync(root, { recursive: true, force: true });
  delete process.env.MY_APP_API_URL;
  delete process.env.OTHER_SECRET;
  passThrough.mockClear();
});

describe('defineConfigWithDotenv', () => {
  it('loads prefixed variables through the root setupNodeEvents', async () => {
    const config = defineConfigWithDotenv({
      dotenv: dotenv(),
      setupNodeEvents: passThrough,
    });

    await (config.setupNodeEvents as SetupNodeEvents)(on, pluginConfig());

    expect(passThrough.mock.calls[0][1].env).toEqual(EXPECTED_ENV);
  });

  it.each(['e2e', 'component'] as const)(
    'loads prefixed variables through the %s setupNodeEvents',
    async (testingType) => {
      const config = defineConfigWithDotenv({
        dotenv: dotenv(),
        [testingType]: { setupNodeEvents: passThrough },
      });

      const setupNodeEvents = config[testingType]
        ?.setupNodeEvents as SetupNodeEvents;

      expect((await setupNodeEvents(on, pluginConfig())).env).toEqual(
        EXPECTED_ENV,
      );
    },
  );

  it('returns the variables when setupNodeEvents returns nothing', async () => {
    const config = defineConfigWithDotenv({
      dotenv: dotenv(),
      e2e: { baseUrl: API_URL, setupNodeEvents: vi.fn() },
    });

    const setupNodeEvents = config.e2e?.setupNodeEvents as SetupNodeEvents;

    expect((await setupNodeEvents(on, pluginConfig())).env).toEqual(
      EXPECTED_ENV,
    );
    expect(config.e2e?.baseUrl).toBe(API_URL);
    expect(config.e2e).not.toHaveProperty('dotenv');
  });
});

// The component preset requires a devServer, which the tests do not need.
type Preset = (options: {
  dotenv?: DotenvRunOptions;
  setupNodeEvents?: typeof passThrough;
}) => { setupNodeEvents?: unknown };

describe.each([
  ['dotenvE2EPreset', dotenvE2EPreset as Preset],
  ['dotenvComponentPreset', dotenvComponentPreset as unknown as Preset],
])('%s', (_, preset) => {
  it('loads prefixed variables without a setupNodeEvents', async () => {
    const setupNodeEvents = preset({ dotenv: dotenv() })
      .setupNodeEvents as SetupNodeEvents;

    expect((await setupNodeEvents(on, pluginConfig())).env).toEqual(
      EXPECTED_ENV,
    );
  });

  it('passes the variables to setupNodeEvents', async () => {
    const setupNodeEvents = preset({
      dotenv: dotenv(),
      setupNodeEvents: passThrough,
    }).setupNodeEvents as SetupNodeEvents;

    await setupNodeEvents(on, pluginConfig());

    expect(passThrough.mock.calls[0][1].env).toEqual(EXPECTED_ENV);
  });
});
