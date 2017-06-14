import path from 'path';
import license from 'rollup-plugin-license';
import resolve from 'rollup-plugin-node-resolve';
import buble from 'rollup-plugin-buble';

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'predication',
  plugins: [
    resolve(),
    buble(),
    license({
      banner: {
        file: path.join(__dirname, 'banner.txt')
      }
    })
  ],
  dest: 'dist/predication.js'
};