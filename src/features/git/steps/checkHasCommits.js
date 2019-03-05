import chalk from 'chalk'
import { execFileSync } from 'child_process'
import pipe from 'mojiscript/core/pipe'
import ifError from 'mojiscript/logic/ifError'
import getMessage from '../getMessage'

const execOptions = { stdio: 'inherit' }

const sayHasInitialCommit = () =>
  console.log(`${chalk.green('✔')} ${getMessage('has-initial-commit')}`)

export const createInitialCommit = pipe([
  () =>
    execFileSync(
      'git',
      ['commit', '-m', 'chore: initial commit', '--allow-empty'],
      execOptions
    ),
  sayHasInitialCommit
])

const gitLog = () => execFileSync('git', ['log'], execOptions)

export const hasCommits = ifError(gitLog)(() => false)(() => true)
