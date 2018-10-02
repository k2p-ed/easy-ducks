/* eslint func-names: 0 */

module.exports = function (api) {
  api.cache(true)

  const plugins = [
    '@babel/proposal-class-properties'
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
