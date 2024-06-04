import type { DotenvRunOptions } from '@dotenv-run/core';
import { defineConfig } from 'cypress';

import { parseEnvVariables } from '../utilities';

export type CyDefineComponentConfig = Parameters<typeof defineConfig>[0]['component'];

export type DotenvComponentPresetConfigOptions = CyDefineComponentConfig & {
  dotenv?: DotenvRunOptions;
};

export const dotenvComponentPreset = (
  dotenvComponentPresetConfigOptions: DotenvComponentPresetConfigOptions,
): CyDefineComponentConfig => {
  const { dotenv, ...config } = dotenvComponentPresetConfigOptions;

  const oldSetupNodeEvents = config.setupNodeEvents;

  config.setupNodeEvents = (onPluginEvent, pluginConfigOptions) => {
    const nextPluginConfigOptions = parseEnvVariables(dotenv, pluginConfigOptions);

    return oldSetupNodeEvents?.(onPluginEvent, nextPluginConfigOptions);
  };

  return config;
};
