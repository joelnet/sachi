import chalk from 'chalk'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import shell from 'shelljs'
import getMessage from '../getMessage'

const sayNoGitRepository = () =>
  console.log(`${chalk.red('❌')} ${getMessage('no-git-repository')}`)

const sayHasGitRepository = () =>
  console.log(`${chalk.green('✔')} ${getMessage('has-git-repository')}`)

const abort = pipe([
  () => console.log(`${chalk.red('abort:')} ${getMessage('abort-git')}`),
  () => Promise.reject({ abort: true })
])

const hasNoGit = ({ stderr }) => /^fatal: Not a git repository/.test(stderr)

const confirmGitInstall = () =>
  inquirer.prompt([
    {
      name: 'confirmed',
      message: getMessage('initialize-git'),
      type: 'confirm'
    }
  ])

const isConfirmed = o => o.confirmed

const installGit = pipe([() => shell.exec('git init'), sayHasGitRepository])

const maybeInstallGit = pipe([
  sayNoGitRepository,
  confirmGitInstall,
  ifElse(isConfirmed)(installGit)(abort)
])

const checkInstallStep = pipe([
  () => Promise.resolve(shell.exec('git log', { silent: true })),
  ifElse(hasNoGit)(maybeInstallGit)(sayHasGitRepository)
])

export default checkInstallStep
