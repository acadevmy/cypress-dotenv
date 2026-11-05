import type { DotenvRunOptions } from '@dotenv-run/core';
import { defineConfig } from 'cypress';

import { withDotenv } from '../utilities/with-dotenv';

export type CyDefineE2EConfig = Parameters<typeof defineConfig>[0]['e2e'];

export type DotenvE2EPresetConfigOptions = CyDefineE2EConfig & {
  dotenv?: DotenvRunOptions;
};

export const dotenvE2EPreset = (
  dotenvE2EPresetConfigOptions: DotenvE2EPresetConfigOptions,
): CyDefineE2EConfig => {
  const { dotenv, ...config } = dotenvE2EPresetConfigOptions;

  config.setupNodeEvents = withDotenv(dotenv, config.setupNodeEvents);

  return config;
};
