const {
  createWebpackConfig,
  createFederationShared,
} = require('@coffee-cats/shared/webpack/createWebpackConfig');
const {
  MF_PORTS,
  MF_NAMES,
  HOST_REMOTES,
} = require('@coffee-cats/shared/webpack/constants');

module.exports = createWebpackConfig({
  projectRoot: __dirname,
  port: MF_PORTS.host,
  htmlTemplate: './public/index.html',
  federation: {
    name: MF_NAMES.host,
    remotes: HOST_REMOTES,
    shared: createFederationShared(),
  },
});