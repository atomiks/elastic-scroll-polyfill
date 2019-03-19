const { rollup } = require('rollup')
const babel = require('rollup-plugin-babel')
const resolve = require('rollup-plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')

const NAME = 'elasticScroll'
const extensions = ['.js', '.ts']

const pluginBabel = babel({ extensions })
const pluginResolve = resolve({ extensions })
const pluginMinify = terser()

const rollupConfig = (...plugins) => ({
  input: './src/index.ts',
  plugins: [pluginBabel, pluginResolve, ...plugins],
})

const output = format => file => ({
  name: NAME,
  format,
  file,
  sourcemap: true,
})

const umd = output('umd')
const esm = output('es')

async function build() {
  const bundle = await rollup(rollupConfig())
  const bundleMin = await rollup(rollupConfig(pluginMinify))

  bundle.write(umd(`./dist/${NAME}.js`))
  bundleMin.write(umd(`./dist/${NAME}.min.js`))
  bundle.write(esm(`./dist/esm/${NAME}.js`))
  bundleMin.write(esm(`./dist/esm/${NAME}.min.js`))
}

build()
