import pipe from 'mojiscript/core/pipe'
import { join } from 'path'
import fs from 'fs-extra'
import tap from 'mojiscript/function/tap'

const readPackageJson = pipe([
  () => fs.readFile(join(process.cwd(), 'package.json'), 'utf8'),
  text => JSON.parse(text)
])

const writePackageJson = pipe([
  json => JSON.stringify(json, null, 2),
  text => fs.writeFile(join(process.cwd(), 'package.json'), text)
])

const updatePackageJson = pipe([
  readPackageJson,
  tap(json => (json.scripts.test = 'jest')),
  tap(json => (json.scripts['test:coverage'] = 'npm run test -- --coverage')),
  writePackageJson
])

export default updatePackageJson
