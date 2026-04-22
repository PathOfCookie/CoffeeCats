const MF_PORTS = {
  host: 3000,
  mfAuth: 3001,
  mfProducts: 3002,
  mfCats: 3003,
};

const MF_NAMES = {
  host: 'host',
  mfAuth: 'mf_auth',
  mfProducts: 'mf_products',
  mfCats: 'mf_cats',
};

const HOST_REMOTES = {
  [MF_NAMES.mfAuth]: `${MF_NAMES.mfAuth}@http://localhost:${MF_PORTS.mfAuth}/remoteEntry.js`,
  [MF_NAMES.mfProducts]: `${MF_NAMES.mfProducts}@http://localhost:${MF_PORTS.mfProducts}/remoteEntry.js`,
  [MF_NAMES.mfCats]: `${MF_NAMES.mfCats}@http://localhost:${MF_PORTS.mfCats}/remoteEntry.js`,
};

module.exports = {
  MF_PORTS,
  MF_NAMES,
  HOST_REMOTES,
};
