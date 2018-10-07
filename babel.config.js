/* eslint func-names: 0 */

module.exports = function (api) {
  api.cache(true)

  const plugins = [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-transform-flow-strip-types'
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
