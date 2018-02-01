/* global __dirname */
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import { plugins } from './rollup.config';

export default {
  input: 'src/main.dev.js',
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
    ...plugins,
  ]
};
