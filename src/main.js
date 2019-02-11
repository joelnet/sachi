import pipeSync from 'mojiscript/core/pipe/sync'
import { join } from 'path'
import promiseSerial from './lib/promiseSerial'
import loadYaml from './lib/loadYaml'
import inquirer from 'inquirer'

const getConfigName = options => options.config || 'default'

const configFileName = name => join(__dirname, `./configs/${name}/index.yml`)

const optionsToConfig = pipeSync([getConfigName, configFileName, loadYaml])

const optionsToFeatures = pipeSync([optionsToConfig, config => config.features])

const isRequired = ([, value]) => value && value.required
const isNotRequired = o => !isRequired(o)

const main = async ({ options }) => {
  const features = await optionsToFeatures(options)
  const requiredFeatures = Object.entries(features).filter(isRequired)
  const optionalFeatures = Object.entries(features).filter(isNotRequired)

  const required = requiredFeatures.map(
    ([feature]) => require(join(__dirname, `./features/${feature}`)).default
  )

  const optional = () =>
    inquirer
      .prompt([
        {
          name: 'choice',
          message: 'Feature List',
          choices: [
            ...optionalFeatures.map(([, feature]) => feature.description),
            'Done'
          ],
          type: 'list'
        }
      ])
      .then(({ choice }) =>
        optionalFeatures
          .filter(([, o]) => o.description === choice)
          .map(([feature]) => feature)
      )
      .then(features =>
        features.map(feature =>
          require(join(__dirname, `./features/${feature}`)).default()
        )
      )

  return promiseSerial(required).then(optional)
}

export default main
