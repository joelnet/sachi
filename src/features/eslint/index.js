import chalk from 'chalk'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import cond from 'mojiscript/logic/cond'
import ifElse from 'mojiscript/logic/ifElse'
import getMessage from './lib/getMessage'
import installPackages from './steps/installPackages'
import setEslintConfig, { hasPrettierRules } from './steps/setEslintConfig'
import { readPackageJson, setPackageJson } from './steps/setPackageJson'

const yes = chalk.green('✔')
const maybe = chalk.yellow('⚠️')

const hasEslint = (o = {}) => !!o.eslint
const hasPrettier = (o = {}) => !!o.prettier
const hasJest = (o = {}) => !!o.jest

const getState = pipe([
  readPackageJson,
  ({ devDependencies }) => ({
    eslint: hasEslint(devDependencies),
    jest: hasJest(devDependencies),
    prettier: hasPrettier(devDependencies)
  })
])

const messageInstalled = () => `${yes} ${getMessage('description')}`
const messageNotInstalled = () => `${maybe} ${getMessage('description')}`

const installEslint = pipe([installPackages, setPackageJson, setEslintConfig])

const createChoices = state =>
  Promise.all([
    {
      name: `${hasEslint(state) ? yes : maybe} Install ESLint`,
      value: 'install'
    },
    pipe([
      hasPrettierRules,
      has => ({
        name: `${has ? yes : maybe} Add Prettier Rules`,
        value: 'eslint'
      })
    ])(),
    { name: 'Done' }
  ])

const displayPrompt = pipe([
  state =>
    Promise.all([
      state,
      inquirer.prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'ESLint - The pluggable linting utility for JavaScript',
          choices: () => createChoices(state),
          default: 'Done'
        }
      ])
    ]),
  ([state, { choice }]) => ({ state, choice })
])

const processChoices = cond([
  [
    ({ choice }) => choice === 'install',
    ({ state }) => pipe([installEslint(state), run])()
  ],
  [
    ({ choice }) => choice === 'eslint',
    ({ state }) => pipe([setEslintConfig(state), run])()
  ]
])

const run = pipe([getState, displayPrompt, processChoices])

export const test = pipe([
  getState,
  ifElse(hasEslint)(messageInstalled)(messageNotInstalled)
])

export default run
