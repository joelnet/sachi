import fs from 'fs'
import yaml from 'js-yaml'
import pipeSync from 'mojiscript/core/pipe/sync'
import { join } from 'path'

const fullPath = join(__dirname, `../resource.yml`)
const loadResources = pipeSync([fs.readFileSync, yaml.safeLoad])
const getMessage = key => loadResources(fullPath)[key]

export default getMessage
