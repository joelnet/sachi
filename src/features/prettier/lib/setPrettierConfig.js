import fs from 'fs-extra'
import pipe from 'mojiscript/core/pipe'
import { join } from 'path'
import yaml from 'js-yaml'

const filePath = join(process.cwd(), '.prettierrc.yaml')

const ensureFile = () => fs.ensureFile(filePath)
const readFile = pipe([
  () => fs.readFile(filePath, 'utf8'),
  yaml.safeLoad,
  json => json || {}
])
const writeFile = pipe([yaml.safeDump, text => fs.writeFile(filePath, text)])

const setDefaults = pipe([
  json =>
    Object.assign(json, {
      semi: json.semi || false,
      singleQuote: json.singleQuote || true,
      tabWidth: json.tabWidth || 2
    })
])

const setPrettierConfig = pipe([ensureFile, readFile, setDefaults, writeFile])

export default setPrettierConfig
