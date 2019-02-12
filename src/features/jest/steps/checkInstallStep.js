import chalk from 'chalk'
import child_process from 'child_process'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import cond from 'mojiscript/logic/cond'
import ifElse from 'mojiscript/logic/ifElse'
import { join } from 'path'
import getMessage from '../getMessage'
import updatePackageJson from '../lib/updatePackageJson'
import createTestFiles from '../lib/createTestFiles'
import updateEslint from '../lib/updateEslint'

// TODO: When installing Jest, modify package.json

const hasJest = o => o.jest
const hasJestNoBabel = o => o.jest && !o['babel-jest']
const hasJestAndBabel = o => o.jest && o['babel-jest']

export const sayJestInstalled = () =>
  console.log(`${chalk.green('✔')} ${getMessage('has-jest')}`)

const createChoices = state => [
  ...(hasJest(state)
    ? []
    : [getMessage('with-babel'), getMessage('without-babel')]),
  ...(!hasJestNoBabel(state) ? [] : [getMessage('upgrade-babel')]),
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

const choseWithBabel = ({ choice }) => choice === getMessage('with-babel')
const choseJestOnly = ({ choice }) => choice === getMessage('without-babel')
const choseUpgradeBabel = ({ choice }) => choice === getMessage('upgrade-babel')

const npmInstall = packageName =>
  child_process.execFileSync('npm', ['install', packageName, '--save-dev'], {
    stdio: 'inherit'
  })

const installJest = pipe([
  () => npmInstall('jest'),
  updatePackageJson,
  createTestFiles,
  updateEslint,
  sayJestInstalled
])
const installBabelJest = pipe([
  () => npmInstall('babel-jest'),
  updatePackageJson,
  createTestFiles,
  updateEslint,
  sayJestInstalled
])

const abort = pipe([
  () => console.log(`${chalk.yellow('skip:')} ${getMessage('abort')}`),
  () => Promise.resolve()
])

const promptUser = pipe([
  promptForConfirmation,
  cond([
    [choseWithBabel, pipe([installJest, installBabelJest])],
    [choseJestOnly, installJest],
    [choseUpgradeBabel, installBabelJest],
    [(() => true, abort)]
  ])
])

export const getJestState = () =>
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

export const testInstall = pipe([
  getJestState,
  cond([
    [
      hasJestNoBabel,
      `${chalk.green('✔')} ${getMessage('test-has-jest-no-babel')}`
    ],
    [
      hasJestAndBabel,
      `${chalk.green('✔')} ${getMessage('test-has-jest-and-babel')} ${chalk.green('✔')}` // prettier-ignore
    ],
    [() => true, `${chalk.yellow('⚠️')}  ${getMessage('test-no-jest')}`]
  ])
])

export default checkInstallStep
