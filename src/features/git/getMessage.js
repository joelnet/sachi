import fs from 'fs'
import yaml from 'js-yaml'
import pipe from 'mojiscript/core/pipe'
import { join } from 'path'

const loadResources = pipe([
  () => join(__dirname, `resource.yml`),
  fs.readFileSync,
  yaml.safeLoad
])

const getMessage = pipe([
  key => loadResources()[key],
  value => value.replace(/{{CWD}}/g, process.cwd())
])

export default getMessage
