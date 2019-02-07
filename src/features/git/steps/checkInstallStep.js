import chalk from 'chalk'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import { join } from 'path'
import shell from 'shelljs'
import getMessage from '../getMessage'

const sayNoGitRepository = () =>
  console.log(`${chalk.red('❌')} ${getMessage('no-git-repository')}`)

const sayHasGitRepository = () =>
  console.log(`${chalk.green('✔')} ${getMessage('has-git-repository')}`)

const promptForConfirmation = () =>
  inquirer.prompt([
    {
      name: 'confirmed',
      message: getMessage('initialize-git'),
      type: 'confirm'
    }
  ])

const isConfirmed = o => o.confirmed

const installGit = pipe([() => shell.exec('git init'), sayHasGitRepository])

const abort = pipe([
  () => console.log(`${chalk.red('abort:')} ${getMessage('abort-git')}`),
  () => Promise.reject({ abort: true })
])

const maybeInstallGit = pipe([
  sayNoGitRepository,
  promptForConfirmation,
  ifElse(isConfirmed)(installGit)(abort)
])

const hasGitDirectory = () => fs.pathExists(join(process.cwd(), '.git'))

const checkInstallStep = pipe([
  hasGitDirectory,
  ifElse(x => x)(sayHasGitRepository)(maybeInstallGit)
])

export default checkInstallStep
