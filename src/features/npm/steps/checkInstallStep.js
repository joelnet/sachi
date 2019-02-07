import chalk from 'chalk'
import child_process from 'child_process'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import { join } from 'path'
import getMessage from '../getMessage'

const sayNoPackageJson = () =>
  console.log(`${chalk.red('❌')} ${getMessage('no-package-json')}`)

const sayHasPackageJson = () =>
  console.log(`${chalk.green('✔')} ${getMessage('has-package-json')}`)

const promptForConfirmation = () =>
  inquirer.prompt([
    {
      name: 'confirmed',
      message: getMessage('initialize-npm'),
      type: 'confirm'
    }
  ])

const isConfirmed = o => o.confirmed

const npmInit = pipe([
  () => child_process.execFileSync('npm', ['init'], { stdio: 'inherit' }),
  sayHasPackageJson
])

const abort = pipe([
  () => console.log(`${chalk.red('abort:')} ${getMessage('abort')}`),
  () => Promise.reject({ abort: true })
])

const maybeNpmInit = pipe([
  sayNoPackageJson,
  promptForConfirmation,
  ifElse(isConfirmed)(npmInit)(abort)
])

const hasPackageJson = () => fs.pathExists(join(process.cwd(), 'package.json'))

const checkInstallStep = pipe([
  hasPackageJson,
  ifElse(x => x)(sayHasPackageJson)(maybeNpmInit)
])

export default checkInstallStep
