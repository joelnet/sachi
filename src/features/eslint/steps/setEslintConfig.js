import fs from 'fs-extra'
import yaml from 'js-yaml'
import W from 'mojiscript/combinators/W'
import pipe from 'mojiscript/core/pipe'
import tap from 'mojiscript/function/tap'
import when from 'mojiscript/logic/when'
import { join } from 'path'

const fileName = join(process.cwd(), '.eslintrc.yml')

const readEslintRc = pipe([
  () => fs.readFile(fileName),
  yaml.safeLoad,
  eslintrc => eslintrc || {}
])

const writeEslintRc = pipe([
  yaml.safeDump,
  text => fs.writeFile(fileName, text)
])

const setEnvDefaults = config =>
  pipe([
    obj => ({ ...obj, env: obj.env || {} }),
    obj => ({
      ...obj,
      env: { ...obj.env, es6: obj.env.es6 || true }
    }),
    when(() => config.jest)(obj => ({
      ...obj,
      env: { ...obj.env, jest: obj.env.jest || true }
    }))
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
    () => fs.ensureFile(fileName),
    readEslintRc,
    setEnvDefaults(config),
    setParserOptions,
    when(() => config.prettier)(pipe([setPlugins, setRules, setExtends])),
    writeEslintRc
  ])
)

export default tap(setEslintConfig)
