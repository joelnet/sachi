import chalk from 'chalk'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import shell from 'shelljs'
import getMessage from '../getMessage'

const sayHasInitialCommit = () =>
  console.log(`${chalk.green('✔')} ${getMessage('has-initial-commit')}`)

const sayNoInitialCommit = () =>
  console.log(`${chalk.red('❌')} ${getMessage('no-initial-commit')}`)

const hasNoCommits = ({ stderr }) =>
  /^fatal: your current branch '[^']+' does not have any commits yet\n$/.test(
    stderr
  )

const isConfirmed = o => o.confirmed

const confirmInitialCommit = () =>
  inquirer.prompt([
    { name: 'confirmed', message: 'Create initial commit', type: 'confirm' }
  ])

const createInitialCommit = pipe([
  () => shell.exec('git commit -m "chore(git): initial commit" --allow-empty'),
  sayHasInitialCommit
])

const abort = pipe([
  () => console.log(`${chalk.red('abort:')} ${getMessage('abort-commits')}`),
  () => Promise.reject({ abort: true })
])

const maybeCreateInitialCommit = pipe([
  sayNoInitialCommit,
  confirmInitialCommit,
  ifElse(isConfirmed)(createInitialCommit)(abort)
])

const checkCommits = pipe([
  () => Promise.resolve(shell.exec('git log', { silent: true })),
  ifElse(hasNoCommits)(maybeCreateInitialCommit)(sayHasInitialCommit)
])

export default checkCommits
