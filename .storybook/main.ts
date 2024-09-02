import type { StorybookConfig } from '@storybook/react-webpack5';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';
import NodePolyfillPlugin from 'node-polyfill-webpack-plugin';

const config: StorybookConfig = {
  framework: {
    name: "@storybook/react-webpack5",
    options: {},
  },
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  core: {
    builder: {
      name: '@storybook/builder-webpack5',
      options: {
        fsCache: false,
        lazyCompilation: true,
      },
    },
  },
    webpackFinal: async (config) => {
        if (config.plugins) {
          config.plugins.push(new NodePolyfillPlugin());
        }
        if (config.resolve) {
          config.resolve.plugins = [new TsconfigPathsPlugin()];
        }
    return config;
  },
  typescript: {
    check: false,
    skipCompiler: false,
    reactDocgen: 'react-docgen-typescript',
  },
  addons: [
      "@storybook/preset-create-react-app",
      "@storybook/addon-onboarding",
      "@storybook/addon-links",
      "@storybook/addon-essentials",
      "@chromatic-com/storybook",
      "@storybook/addon-interactions",
      "@storybook/addon-webpack5-compiler-babel"
  ],
};
 
export default config;
