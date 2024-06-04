# @devmy/cypress-dotenv

`@devmy/cypress-dotenv` is a TypeScript library designed to integrate `dotenv` configuration with `@dotenv-run/core` into your Cypress setup, simplifying the management of environment variables for both component and end-to-end (E2E) tests.

- ✅ Load environment variables from .env files
- ✅ Load environment variables from .env.vault files
- ✅ Expand environment variables API_URL=$API_BASE/users
- ✅ Define environment variables for a specific environment (e.g. .env.production)
- ✅ Load priorities of .env.* files (e.g. .env.production > .env)
- ✅ Hierarchical cascading configuration in monorepo projects (Nx, Turbo, etc.) apps/next-app/.env > apps/.env > .env

## Installation

Install the package via npm:

```bash
npm install @devmy/cypress-dotenv
```

or via yarn:

```bash
yarn add @devmy/cypress-dotenv
```

or via pnpm:

```bash
pnpm add @devmy/cypress-dotenv
```

## Usage

### Dotenv Configuration
The `dotenv` configuration options in this library use `DotenvRunOptions` of [dotenv-run/core](https://www.npmjs.com/package/@dotenv-run/core).

### `defineConfigWithDotenv`

The `defineConfigWithDotenv` function invokes Cypress's `defineConfig`, loading environment variables from `dotenv`.

#### Example:

```typescript
import { defineConfigWithDotenv } from '@devmy/cypress-dotenv';

export default defineConfigWithDotenv({
   dotenv: {
    prefix: 'FRONTEND_E2E_',
    root: '../../',
  },
  component: {
    specPattern: 'src/**/*.cy.ts',
  },
  e2e: {
    baseUrl: 'http://localhost:3000',
  },
});
```

### `dotenvComponentPreset`

The `dotenvComponentPreset` function loads `dotenv` for component tests in Cypress.

#### Example:

```typescript
import { dotenvComponentPreset } from '@devmy/cypress-dotenv';

export default dotenvComponentPreset({
  dotenv: {
    prefix: 'FRONTEND_E2E_',
    root: '../../',
  },
  devServer: {
    framework: 'react',
    bundler: 'webpack',
  },
});
```

### `dotenvE2EPreset`

The `dotenvE2EPreset` function loads `dotenv` for E2E tests in Cypress.

#### Example:

```typescript
import { dotenvE2EPreset } from '@devmy/cypress-dotenv';

export default dotenvE2EPreset({
  dotenv: {
    prefix: 'FRONTEND_E2E_',
    root: '../../',
  },
  baseUrl: 'http://localhost:3000',
});
```


## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes.