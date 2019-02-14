import chalk from 'chalk'
import child_process from 'child_process'
import I from 'mojiscript/combinators/I'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import getMessage from './lib/getMessage'
import setPrettierConfig from './lib/setPrettierConfig'
import { readPackageJson } from './lib/updatePackageJson'

const hasPrettier = (o = {}) => !!o.prettier

const getState = pipe([
  readPackageJson,
  packageJson => ({
    prettier: hasPrettier(packageJson.devDependencies)
  })
])

const messageInstalled = () =>
  `${chalk.green('✔')} ${getMessage('description')}`

const messageNotInstalled = () =>
  `${chalk.yellow('⚠️')} ${getMessage('description')}`

const npmInstall = packageName =>
  child_process.execFileSync('npm', ['install', packageName, '--save-dev'], {
    stdio: 'inherit'
  })

const ifDoesNotHavePrettier = ifElse(hasPrettier)(I)

const installPrettier = pipe([
  () => npmInstall(getMessage('prettier')),
  setPrettierConfig
])

const maybeInstallPrettier = pipe([
  getState,
  ifDoesNotHavePrettier(installPrettier)
])

export const test = pipe([
  getState,
  ifElse(hasPrettier)(messageInstalled)(messageNotInstalled)
])

export default maybeInstallPrettier
