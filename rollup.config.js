import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

const MAIN = {
  input: 'src/index.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ]
}

const AXIOS = {
  input: 'src/plugins/axios.js',
  output: [
    { file: 'lib/plugins/axios/index.js', format: 'cjs' }
  ]
}

const FETCH = {
  input: 'src/plugins/fetch.js',
  output: [
    { file: 'lib/plugins/fetch/index.js', format: 'cjs' }
  ]
}

const COMMON = {
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      exclude: ['node_modules/**'],
      plugins: [
        '@babel/plugin-proposal-class-properties',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-transform-flow-strip-types'
      ],
      presets: [
        '@babel/react',
        ['@babel/env', { modules: false }],
        '@babel/flow'
      ]
    }),
    commonjs()
  ],
  external: [
    'axios',
    'react',
    'react-dom',
    'prop-types'
  ]
}

export default [
  Object.assign({}, MAIN, COMMON),
  Object.assign({}, AXIOS, COMMON),
  Object.assign({}, FETCH, COMMON)
]
