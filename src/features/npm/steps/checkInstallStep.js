import chalk from 'chalk'
import child_process from 'child_process'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import getMessage from '../getMessage'
import hasPackageJson from '../lib/hasPackageJson'
import {
  isConfirmed,
  promptForConfirmation
} from '../lib/promptForConfirmation'

const sayNoPackageJson = () =>
  console.log(`${chalk.red('❌')}  ${getMessage('no-package-json')}`)

const sayHasPackageJson = () =>
  console.log(`${chalk.green('✔')}  ${getMessage('has-package-json')}`)

const npmInit = pipe([
  () => child_process.execFileSync('npm', ['init'], { stdio: 'inherit' }),
  sayHasPackageJson
])

const abort = pipe([
  () => console.log(`${chalk.red('abort:')}  ${getMessage('abort')}`),
  () => Promise.reject({ abort: true })
])

const maybeNpmInit = pipe([
  sayNoPackageJson,
  promptForConfirmation,
  ifElse(isConfirmed)(npmInit)(abort)
])

const checkInstallStep = pipe([
  ifElse(hasPackageJson)(sayHasPackageJson)(maybeNpmInit)
])

export default checkInstallStep
