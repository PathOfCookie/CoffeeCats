const {
  createWebpackConfig,
  createFederationShared,
} = require('@coffee-cats/shared/webpack/createWebpackConfig');
const { MF_PORTS, MF_NAMES } = require('@coffee-cats/shared/webpack/constants');

module.exports = createWebpackConfig({
  projectRoot: __dirname,
  port: MF_PORTS.mfProducts,
  federation: {
    name: MF_NAMES.mfProducts,
    filename: 'remoteEntry.js',
    exposes: {
      './ProductsTable': './src/ProductsTable',
    },
    shared: createFederationShared({
      axios: { singleton: true, eager: true },
    }),
  },
});