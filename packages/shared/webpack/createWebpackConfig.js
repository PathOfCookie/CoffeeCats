const path = require('path');
const { ModuleFederationPlugin } = require('webpack').container;

function createFederationShared(extraShared = {}) {
  return {
    react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
    'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
    'react-router-dom': { singleton: true, eager: true, requiredVersion: '^6.22.0' },
    '@coffee-cats/shared': { singleton: true, eager: true },
    ...extraShared,
  };
}

function createWebpackConfig(options = {}) {
  const {
    projectRoot,
    entry = './src/index.ts',
    port,
    federation,
    htmlTemplate,
    output = {},
    externals,
    extraPlugins = [],
  } = options;

  if (!projectRoot) {
    throw new Error('createWebpackConfig: "projectRoot" is required.');
  }

  const plugins = [];

  if (federation) {
    plugins.push(new ModuleFederationPlugin(federation));
  }

  if (htmlTemplate) {
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    plugins.push(
      new HtmlWebpackPlugin({
        template: htmlTemplate,
      })
    );
  }

  plugins.push(...extraPlugins);

  const config = {
    entry,
    output: {
      publicPath: 'auto',
      path: path.resolve(projectRoot, 'dist'),
      ...output,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    plugins,
  };

  if (externals) {
    config.externals = externals;
  }

  if (port) {
    config.devServer = {
      port,
      hot: true,
      historyApiFallback: true,
    };
  }

  return config;
}

module.exports = { createWebpackConfig, createFederationShared };
