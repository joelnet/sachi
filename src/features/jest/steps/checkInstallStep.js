import chalk from 'chalk'
import child_process from 'child_process'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import { join } from 'path'
import cond from 'mojiscript/logic/cond'
import getMessage from '../getMessage'

// TODO: When installing Jest, modify package.json

const sayJestInstalled = () =>
  console.log(`${chalk.green('✔')} ${getMessage('has-jest')}`)

const createChoices = state => [
  ...(state['jest']
    ? []
    : [getMessage('with-babel'), getMessage('without-babel')]),
  ...(!state['jest'] || state['babel-jest']
    ? []
    : [getMessage('upgrade-babel')]),
  getMessage('cancel')
]

const promptForConfirmation = state =>
  inquirer.prompt([
    {
      name: 'choice',
      message: getMessage('topic'),
      choices: createChoices(state),
      type: 'list'
    }
  ])

const isWithBabel = ({ choice }) => choice === getMessage('with-babel')
const isJestOnly = ({ choice }) => choice === getMessage('without-babel')
const isUpgradeBabel = ({ choice }) => choice === getMessage('upgrade-babel')

const npmInstall = packageName =>
  child_process.execFileSync('npm', ['install', packageName, '--save-dev'], {
    stdio: 'inherit'
  })

const installJest = pipe([() => npmInstall('jest'), sayJestInstalled])
const installBabelJest = pipe([
  () => npmInstall('babel-jest'),
  sayJestInstalled
])

const abort = pipe([
  () => console.log(`${chalk.yellow('skip:')} ${getMessage('abort')}`),
  () => Promise.resolve()
])

const promptUser = pipe([
  promptForConfirmation,
  cond([
    [isWithBabel, pipe([installJest, installBabelJest])],
    [isJestOnly, installJest],
    [isUpgradeBabel, installBabelJest],
    [(() => true, abort)]
  ])
])

const getJestState = () =>
  fs
    .readFile(join(process.cwd(), 'package.json'), 'utf8')
    .then(file => JSON.parse(file))
    .then(packageJson => ({
      jest: !!packageJson.devDependencies.jest,
      'babel-jest': !!packageJson.devDependencies['babel-jest']
    }))

const checkInstallStep = pipe([
  getJestState,
  ifElse(o => !o.jest || !o['babel-jest'])(promptUser)(sayJestInstalled)
])

export default checkInstallStep
