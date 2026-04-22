const {
  createWebpackConfig,
  createFederationShared,
} = require('@coffee-cats/shared/webpack/createWebpackConfig');
const { MF_PORTS, MF_NAMES } = require('@coffee-cats/shared/webpack/constants');

module.exports = createWebpackConfig({
  projectRoot: __dirname,
  port: MF_PORTS.mfCats,
  federation: {
    name: MF_NAMES.mfCats,
    filename: 'remoteEntry.js',
    exposes: {
      './CatsTable': './src/CatsTable',
    },
    shared: createFederationShared({
      axios: { singleton: true, eager: true },
    }),
  },
});