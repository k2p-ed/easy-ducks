import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

export default {
  input: 'src/index.js',
  output: [
    { file: pkg.main, format: 'cjs' },
    { file: pkg.module, format: 'es' }
  ],
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
    'react',
    'react-dom',
    'prop-types'
  ]
}
