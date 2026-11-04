import type { DotenvRunOptions } from '@dotenv-run/core';

import { parseEnvVariables } from './parse-env-variables';

type SetupNodeEvents = (
  onPluginEvent: Cypress.PluginEvents,
  pluginConfigOptions: Cypress.PluginConfigOptions,
) =>
  | Promise<Cypress.PluginConfigOptions | void>
  | Cypress.PluginConfigOptions
  | void;

/**
 * Wraps setupNodeEvents so that it receives the dotenv variables in `config.env`.
 * Cypress applies only the config returned by setupNodeEvents, so the enhanced
 * config is returned whenever the wrapped function returns nothing.
 */
export const withDotenv =
  (
    dotenv: DotenvRunOptions | undefined,
    setupNodeEvents: SetupNodeEvents | undefined,
  ): SetupNodeEvents =>
  async (onPluginEvent, pluginConfigOptions) => {
    const nextPluginConfigOptions = parseEnvVariables(
      dotenv,
      pluginConfigOptions,
    );

    return (
      (await setupNodeEvents?.(onPluginEvent, nextPluginConfigOptions)) ??
      nextPluginConfigOptions
    );
  };
