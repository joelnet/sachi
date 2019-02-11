import fs from 'fs'
import yaml from 'js-yaml'
import pipeSync from 'mojiscript/core/pipe/sync'

const loadYaml = pipeSync([fs.readFileSync, yaml.safeLoad])

export default loadYaml
