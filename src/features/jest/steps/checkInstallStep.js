import chalk from 'chalk'
import child_process from 'child_process'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import getMessage from '../getMessage'
import createTestFiles from '../lib/createTestFiles'
import updatePackageJson, { readPackageJson } from '../lib/updatePackageJson'

const messageJestInstalled = () =>
  `${chalk.green('✔')} ${getMessage('description')}`

const messageJestNotInstalled = () =>
  `${chalk.yellow('⚠️')} ${getMessage('description')}`

const sayJestInstalled = () => console.log(messageJestInstalled())

const hasJest = (o = {}) => !!o.jest

const npmInstall = packageName =>
  child_process.execFileSync('npm', ['install', packageName, '--save-dev'], {
    stdio: 'inherit'
  })

const installJest = pipe([
  () => npmInstall('jest@^24'),
  updatePackageJson,
  createTestFiles,
  sayJestInstalled
])

export const getJestState = pipe([
  readPackageJson,
  packageJson => ({
    jest: hasJest(packageJson.devDependencies)
  })
])

const checkInstallStep = pipe([
  getJestState,
  ifElse(hasJest)(sayJestInstalled)(installJest)
])

export const testInstall = pipe([
  getJestState,
  ifElse(hasJest)(messageJestInstalled)(messageJestNotInstalled)
])

export default checkInstallStep
