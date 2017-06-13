import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'predication',
  plugins: [ resolve(), buble() ],
  dest: 'dist/predication.js'
};