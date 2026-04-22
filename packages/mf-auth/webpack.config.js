const {
  createWebpackConfig,
  createFederationShared,
} = require('@coffee-cats/shared/webpack/createWebpackConfig');
const { MF_PORTS, MF_NAMES } = require('@coffee-cats/shared/webpack/constants');

module.exports = createWebpackConfig({
  projectRoot: __dirname,
  port: MF_PORTS.mfAuth,
  federation: {
    name: MF_NAMES.mfAuth,
    filename: 'remoteEntry.js',
    exposes: {
      './AuthPage': './src/AuthPage',
    },
    shared: createFederationShared(),
  },
});