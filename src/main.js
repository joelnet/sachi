import fs from 'fs'
import yaml from 'js-yaml'
import { join } from 'path'
import pipe from 'mojiscript/core/pipe'
import promiseSerial from './lib/promiseSerial'

const getConfigName = options => options.config || 'default'

const loadConfig = pipe([
  name => join(__dirname, `./configs/${name}/index.yml`),
  fs.readFileSync,
  yaml.safeLoad
])

const optionsToConfig = pipe([getConfigName, loadConfig])

const optionsToFeatures = pipe([optionsToConfig, config => config.features])

const main = async ({ options }) => {
  const features = await optionsToFeatures(options)
  const funcs = features.map(
    feature => require(join(__dirname, `./features/${feature}`)).default
  )
  return promiseSerial(funcs)
}

export default main
