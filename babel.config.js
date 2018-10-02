/* eslint func-names: 0 */

module.exports = function (api) {
  api.cache(true)

  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining'
  ]

  const presets = [
    '@babel/react',
    '@babel/env',
    '@babel/flow'
  ]

  return {
    plugins,
    presets
  }
}
