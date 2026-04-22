# Shared webpack configuration

This directory contains centralized webpack and Module Federation setup for all frontend apps in the monorepo.

## Files

- `createWebpackConfig.js` - shared webpack config factory:
  - common `resolve` and `module.rules`
  - optional `ModuleFederationPlugin`
  - optional `HtmlWebpackPlugin`
  - optional `devServer` by `port`
- `constants.js` - centralized infrastructure constants:
  - `MF_PORTS` - all app ports
  - `MF_NAMES` - Module Federation container names
  - `HOST_REMOTES` - host remote connection map

## How to update infrastructure

1. Change ports in `MF_PORTS`.
2. If needed, change container names in `MF_NAMES`.
3. `HOST_REMOTES` will continue to use the same names/ports in one place.
4. All webpack configs in `host` and `mf-*` packages consume these constants.

## Where package-level differences stay

Each app keeps only local details in its own `webpack.config.js`:

- federation `exposes` or `remotes`
- app `name`
- app `port`
- app-specific extra shared libs (for example `axios`)
