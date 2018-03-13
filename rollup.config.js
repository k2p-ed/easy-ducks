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
    { file: 'lib/plugins/axios.cjs.js', format: 'cjs' },
    { file: 'lib/plugins/axios.esm.js', format: 'es' }
  ]
}

const FETCH = {
  input: 'src/plugins/fetch.js',
  output: [
    { file: 'lib/plugins/fetch.cjs.js', format: 'cjs' },
    { file: 'lib/plugins/fetch.esm.js', format: 'es' }
  ]
}

const COMMON = {
  plugins: [
    resolve(),
    babel({
      babelrc: false,
      exclude: ['node_modules/**'],
      plugins: [
        'external-helpers',
        'transform-flow-strip-types'
      ],
      presets: [
        'react',
        ['env', { modules: false }],
        'stage-0',
        'flow'
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
