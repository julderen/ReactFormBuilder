import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

const INPUT_FILE = './src/index.js';

export default [
  // CommonJS
  {
    input: INPUT_FILE,
    output: { file: 'lib/reactformbuilder.js', format: 'cjs', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      nodeResolve({
        jsnext: true,
        extensions: ['.js', '.jsx'],
      }),
      babel()],
  },

  // ES
  {
    input: INPUT_FILE,
    output: { file: 'es/reactformbuilder.js', format: 'es', indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
    ],
    plugins: [
      nodeResolve({
        jsnext: true,
        extensions: ['.js', '.jsx'],
      }),
      babel()],
  },
];
