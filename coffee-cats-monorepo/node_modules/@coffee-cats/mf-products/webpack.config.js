const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    publicPath: 'auto',
    path: path.resolve(__dirname, 'dist'),
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
  plugins: [
    new ModuleFederationPlugin({
      name: 'mf_products',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductsTable': './src/ProductsTable',
      },
      shared: {
        react: { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        'react-dom': { singleton: true, eager: true, requiredVersion: '^18.2.0' },
        'react-router-dom': { singleton: true, eager: true, requiredVersion: '^6.22.0' },
        '@coffee-cats/shared': { singleton: true, eager: true },
        axios: { singleton: true, eager: true },
      },
    }),
  ],
  devServer: {
    port: 3002,
    hot: true,
    historyApiFallback: true,
  },
};