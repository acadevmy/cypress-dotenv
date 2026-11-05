import { DotenvRunOptions } from '@dotenv-run/core';
import { defineConfig } from 'cypress';

import { dotenvComponentPreset, dotenvE2EPreset } from './presets';
import { withDotenv } from './utilities/with-dotenv';

export type CyDefineConfig = Parameters<typeof defineConfig>[0];

export type DotenvConfigOptions = CyDefineConfig & {
  dotenv: DotenvRunOptions;
};

export const defineConfigWithDotenv = (
  dotenvConfigOptions: DotenvConfigOptions,
): CyDefineConfig => {
  const { dotenv, ...config } = dotenvConfigOptions;

  config.setupNodeEvents = withDotenv(dotenv, config.setupNodeEvents);

  // Cypress runs the setupNodeEvents of the testing type instead of the root
  // one, so each testing type has to load the dotenv variables too.
  if (config.e2e) {
    config.e2e = dotenvE2EPreset({ ...config.e2e, dotenv });
  }

  if (config.component) {
    config.component = dotenvComponentPreset({ ...config.component, dotenv });
  }

  return defineConfig(config);
};
