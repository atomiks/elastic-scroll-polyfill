const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const minify = require('rollup-plugin-babel-minify')

const pluginBabel = babel({
  babelrc: false,
  exclude: 'node_modules/**',
  presets: ['@babel/preset-env'],
  plugins: [['@babel/plugin-proposal-object-rest-spread', { loose: true }]]
})
const pluginMinify = minify({ comments: false })

const rollupConfig = (...plugins) => ({
  input: './src/index.js',
  plugins: [pluginBabel, ...plugins]
})
const output = format => file => ({
  name: 'elasticScroll',
  format,
  file,
  sourcemap: true
})

const umd = output('umd')
const esm = output('es')

const build = async () => {
  const bundle = await rollup(rollupConfig())
  const bundleMin = await rollup(rollupConfig(pluginMinify))

  bundle.write(umd('./dist/index.js'))
  bundleMin.write(umd('./dist/index.min.js'))
  bundle.write(esm('./dist/esm/index.js'))
  bundleMin.write(esm('./dist/esm/index.min.js'))
}

build()
