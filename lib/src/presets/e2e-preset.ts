import type { DotenvRunOptions } from '@dotenv-run/core';
import { defineConfig } from 'cypress';

import { parseEnvVariables } from '../utilities';

export type CyDefineE2EConfig = Parameters<typeof defineConfig>[0]['e2e'];

export type DotenvE2EPresetConfigOptions = CyDefineE2EConfig & {
  dotenv?: DotenvRunOptions;
};

export const dotenvE2EPreset = (
  dotenvE2EPresetConfigOptions: DotenvE2EPresetConfigOptions,
): CyDefineE2EConfig => {
  const { dotenv, ...config } = dotenvE2EPresetConfigOptions;

  const oldSetupNodeEvents = config.setupNodeEvents;

  config.setupNodeEvents = (onPluginEvent, pluginConfigOptions) => {
    const nextPluginConfigOptions = parseEnvVariables(dotenv, pluginConfigOptions);

    return oldSetupNodeEvents?.(onPluginEvent, nextPluginConfigOptions);
  };

  return config;
};
