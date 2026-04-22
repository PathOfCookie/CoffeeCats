const { createWebpackConfig } = require('./webpack/createWebpackConfig');

module.exports = createWebpackConfig({
  projectRoot: __dirname,
  output: {
    filename: 'index.js',
    library: '@coffee-cats/shared',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  externals: {
    react: 'react',
    'react-dom': 'react-dom',
    'react-router-dom': 'react-router-dom',
  },
});