import fs from 'fs'
import yaml from 'js-yaml'
import pipeSync from 'mojiscript/core/pipe/sync'
import { join } from 'path'

const loadResources = pipeSync([
  () => join(__dirname, `resource.yml`),
  fs.readFileSync,
  yaml.safeLoad
])

const getMessage = key => loadResources()[key]

export default getMessage
