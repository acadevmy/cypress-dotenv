import { DotenvRunOptions } from '@dotenv-run/core';
import { defineConfig } from 'cypress';

import { parseEnvVariables } from './utilities';

export type CyDefineConfig = Parameters<typeof defineConfig>[0];

export type DotenvConfigOptions = CyDefineConfig & {
  dotenv: DotenvRunOptions;
};

export const defineConfigWithDotenv = (
  dotenvConfigOptions: DotenvConfigOptions,
): CyDefineConfig => {
  const { dotenv, ...config } = dotenvConfigOptions;
  const oldSetupNodeEvents = config.setupNodeEvents;

  config.setupNodeEvents = (onPluginEvent, pluginConfigOptions) => {
    const nextPluginConfigOptions = parseEnvVariables(dotenv, pluginConfigOptions);

    return oldSetupNodeEvents?.(onPluginEvent, nextPluginConfigOptions);
  };

  return defineConfig(config);
};
