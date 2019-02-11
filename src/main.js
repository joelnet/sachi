import fs from 'fs'
import yaml from 'js-yaml'
import pipeSync from 'mojiscript/core/pipe/sync'
import { join } from 'path'
import promiseSerial from './lib/promiseSerial'

const getConfigName = options => options.config || 'default'

const loadConfig = pipeSync([
  name => join(__dirname, `./configs/${name}/index.yml`),
  fs.readFileSync,
  yaml.safeLoad
])

const optionsToConfig = pipeSync([getConfigName, loadConfig])

const optionsToFeatures = pipeSync([optionsToConfig, config => config.features])

const main = async ({ options }) => {
  const features = await optionsToFeatures(options)
  const funcs = features.map(
    feature => require(join(__dirname, `./features/${feature}`)).default
  )
  return promiseSerial(funcs)
}

export default main
