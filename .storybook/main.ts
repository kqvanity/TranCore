import type { StorybookConfig } from '@storybook/react-vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/react-vite",
  async viteFinal(config) {
    if (config.plugins) {
      config.plugins.push(tsconfigPaths());
    }
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve?.alias,
        'src/pages/content/fetch.ts': path.resolve(__dirname, '../tests/mocks/fetch.ts'),
        'src/pages/content/pronunciation/forvo.ts': path.resolve(__dirname, '../tests/mocks/pronunciation/forvo.ts'),
      },
    };
    return config;
  },
};
export default config;