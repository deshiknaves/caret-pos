/* global __dirname */
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/main.js',
  output: {
    name: 'caret-position',
    sourcemap: true,
    format: 'umd',
    file: 'lib/main.js',
  },
  plugins: [
    serve({
      port: 8080,
      contentBase: '',
    }),
    livereload({
      watch: ['lib', __dirname + '/styles.css'],
    }),
    eslint(),
    babel({
      exclude: 'node_modules/**',
    }),
  ]
};
