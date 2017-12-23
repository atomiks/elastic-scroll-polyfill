import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

export default {
  input: './elasticscroll.js',
  output: {
    file: './dist/elasticscroll.js',
    format: 'umd'
  },
  name: 'elasticScroll',
  externalHelpers: true,
  plugins: [
    babel({
      presets: ['es2015-rollup'],
      plugins: ['transform-object-assign', 'transform-object-rest-spread']
    }),
    minify({ comments: false })
  ]
}
