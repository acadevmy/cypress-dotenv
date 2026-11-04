import type { DotenvRunOptions } from '@dotenv-run/core';
import { defineConfig } from 'cypress';

import { withDotenv } from '../utilities/with-dotenv';

export type CyDefineComponentConfig = Parameters<
  typeof defineConfig
>[0]['component'];

export type DotenvComponentPresetConfigOptions = CyDefineComponentConfig & {
  dotenv?: DotenvRunOptions;
};

export const dotenvComponentPreset = (
  dotenvComponentPresetConfigOptions: DotenvComponentPresetConfigOptions,
): CyDefineComponentConfig => {
  const { dotenv, ...config } = dotenvComponentPresetConfigOptions;

  config.setupNodeEvents = withDotenv(dotenv, config.setupNodeEvents);

  return config;
};
