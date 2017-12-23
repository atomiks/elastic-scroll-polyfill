import babel from 'rollup-plugin-babel'
import minify from 'rollup-plugin-babel-minify'

export default {
  input: './elastic-scroll.js',
  output: {
    file: './dist/elastic-scroll.js',
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
