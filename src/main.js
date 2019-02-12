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

const createChoices = features =>
  Promise.all([
    ...features.map(([name]) =>
      require(join(__dirname, `./features/${name}`))
        .test()
        .then(longName => ({ name: longName, value: name }))
    ),
    'Done'
  ])

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
          message: 'Available Features:',
          choices: () => createChoices(optionalFeatures),
          type: 'list'
        }
      ])
      .then(
        ({ choice }) =>
          choice !== 'Done' &&
          require(join(__dirname, `./features/${choice}`)).default()
      )
      .then(result => result !== false && optional())

  return promiseSerial(required).then(optional)
}

export default main
