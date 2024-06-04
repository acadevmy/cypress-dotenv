import { DotenvRunOptions, env } from '@dotenv-run/core';
import { cloneDeep, entries } from 'lodash';

export const parseEnvVariables = (
  options: DotenvRunOptions | undefined,
  config: Cypress.PluginConfigOptions,
) => {
  const dotenvRun = env(options);

  const enhancedConfig = cloneDeep(config);
  enhancedConfig.env = enhancedConfig.env ?? {};

  entries(dotenvRun.raw).forEach(([key, value]) => (enhancedConfig.env[key] = value));

  return enhancedConfig;
};
