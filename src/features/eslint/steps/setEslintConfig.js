import fs from 'fs-extra'
import yaml from 'js-yaml'
import I from 'mojiscript/combinators/I'
import W from 'mojiscript/combinators/W'
import pipe from 'mojiscript/core/pipe'
import tap from 'mojiscript/function/tap'
import ifElse from 'mojiscript/logic/ifElse'
import when from 'mojiscript/logic/when'
import { join } from 'path'

const fileName = join(process.cwd(), '.eslintrc.yml')

const readEslintRc = pipe([
  () => fs.exists(fileName),
  ifElse(I)(() => fs.readFile(fileName))(() => ''),
  yaml.safeLoad,
  eslintrc => eslintrc || {}
])

const writeEslintRc = pipe([
  yaml.safeDump,
  text => fs.writeFile(fileName, text)
])

const setEnvDefaults = pipe([
  obj => ({ ...obj, env: obj.env || {} }),
  obj => ({
    ...obj,
    env: {
      ...obj.env,
      es6: obj.env.es6 || true,
      node: obj.env.node || true,
      browser: obj.env.browser || true,
      jest: obj.env.jest || true
    }
  })
])

const setParserOptions = pipe([
  obj => ({ ...obj, parserOptions: obj.parserOptions || {} }),
  obj => ({
    ...obj,
    parserOptions: {
      ...obj.parserOptions,
      ecmaVersion: obj.parserOptions.ecmaVersion || 10,
      sourceType: obj.parserOptions.sourceType || 'module'
    }
  })
])

const setPlugins = pipe([
  obj => ({ ...obj, plugins: obj.plugins || [] }),
  when(obj => obj.plugins.indexOf('prettier') === -1)(obj => ({
    ...obj,
    plugins: ['prettier', ...obj.plugins]
  }))
])

const setRules = pipe([
  obj => ({ ...obj, rules: obj.rules || {} }),
  when(obj => !obj.rules['prettier/prettier'])(obj => ({
    ...obj,
    rules: { 'prettier/prettier': 'error', ...obj.rules }
  }))
])

const setExtends = pipe([
  obj => ({ ...obj, extends: obj.extends || [] }),
  when(obj => obj.extends.indexOf('plugin:prettier/recommended') === -1)(
    obj => ({
      ...obj,
      extends: ['plugin:prettier/recommended', ...obj.extends]
    })
  )
])

const setEslintConfig = W(config =>
  pipe([
    readEslintRc,
    setEnvDefaults,
    setParserOptions,
    when(() => config.prettier)(pipe([setPlugins, setRules, setExtends])),
    writeEslintRc
  ])
)

export const hasPrettierRules = pipe([
  readEslintRc,
  config => !!(config.rules || {})['prettier/prettier']
])

export default tap(setEslintConfig)
