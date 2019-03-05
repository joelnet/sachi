import { execFileSync } from 'child_process'
import ifError from 'mojiscript/logic/ifError'

const execOptions = { stdio: 'inherit' }

export const createInitialCommit = () =>
  execFileSync(
    'git',
    ['commit', '-m', 'chore: initial commit', '--allow-empty'],
    execOptions
  )

const gitLog = () => execFileSync('git', ['log'], execOptions)

export const hasCommits = ifError(gitLog)(() => false)(() => true)
