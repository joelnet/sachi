import fs from 'fs-extra'
import yaml from 'js-yaml'
import pipe from 'mojiscript/core/pipe'
import tap from 'mojiscript/function/tap'
import { join } from 'path'

const fileName = join(process.cwd(), '.eslintrc.yml')

const readEslintRc = pipe([
  () => fs.ensureFile(fileName),
  () => fs.readFile(fileName),
  yaml.safeLoad,
  eslintrc => eslintrc || {}
])

const writeEslintRc = pipe([
  yaml.safeDump,
  text => fs.writeFile(fileName, text)
])

const ensureEnv = tap(obj => Object.assign(obj, { env: obj.env || {} }))
const ensureJest = tap(obj => Object.assign(obj.env, { jest: true }))

const updateEslint = pipe([readEslintRc, ensureEnv, ensureJest, writeEslintRc])

export default updateEslint
