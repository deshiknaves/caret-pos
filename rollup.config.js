import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export const plugins = [
  resolve({
    jsnext: true,
    main: true,
    browser: true,
  }),
  commonjs(),
  eslint(),
  babel({
    exclude: 'node_modules/**',
  }),
];

export default [
  {
    input: 'src/main.js',
    output: {
      name: 'caret-pos',
      sourcemap: true,
      format: 'umd',
      file: 'lib/bundle/main.js',
    },
    plugins,
  },
  {
    input: 'src/main.js',
    output: {
      name: 'caret-pos',
      sourcemap: true,
      format: 'es',
      file: 'lib/esm2015/main.js',
    },
    plugins,
  }
];
