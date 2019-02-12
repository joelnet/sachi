import chalk from 'chalk'
import child_process from 'child_process'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import getMessage from '../getMessage'
import hasGitDirectory from '../lib/hasGitDirectory'
import {
  isConfirmed,
  promptForConfirmation
} from '../lib/promptForConfirmation'

const sayNoGitRepository = () =>
  console.log(`${chalk.red('❌')} ${getMessage('no-git-repository')}`)

const sayHasGitRepository = () =>
  console.log(`${chalk.green('✔')} ${getMessage('has-git-repository')}`)

const installGit = pipe([
  () => child_process.execFileSync('git', ['init'], { stdio: 'inherit' }),
  sayHasGitRepository
])

const abort = pipe([
  () => console.log(`${chalk.red('abort:')} ${getMessage('abort-git')}`),
  () => Promise.reject({ abort: true })
])

const maybeInstallGit = pipe([
  sayNoGitRepository,
  promptForConfirmation,
  ifElse(isConfirmed)(installGit)(abort)
])

const checkInstallStep = pipe([
  ifElse(hasGitDirectory)(sayHasGitRepository)(maybeInstallGit)
])

export default checkInstallStep
