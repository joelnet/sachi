import fs from 'fs-extra'
import pipe from 'mojiscript/core/pipe'
import { join } from 'path'

export const readPackageJson = pipe([
  () => fs.readFile(join(process.cwd(), 'package.json'), 'utf8'),
  text => JSON.parse(text)
])

const writePackageJson = pipe([
  json => JSON.stringify(json, null, 2),
  text => fs.writeFile(join(process.cwd(), 'package.json'), text)
])

export const updatePackageJson = pipe([
  readPackageJson,
  json => ({ ...json, scripts: { ...(json.scripts || {}), lint: 'eslint .' } }),
  writePackageJson
])
