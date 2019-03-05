import chalk from 'chalk'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import cond from 'mojiscript/logic/cond'
import ifElse from 'mojiscript/logic/ifElse'
import when from 'mojiscript/logic/when'
import {
  ABORT,
  DONE,
  getDefaultChoice,
  GIT_IGNORE,
  INITIALIZE_GIT,
  INITIAL_COMMIT
} from './choices'
import getMessage from './getMessage'
import { addGitIgnore, hasGitIgnore } from './steps/addGitIgnore'
import { createInitialCommit, hasCommits } from './steps/checkHasCommits'
import { initGit, isGitInstalled } from './steps/initGit'

const isChoice = c => ({ choice }) => choice === c

const hasGitDirectoryPrompt = () => [
  {
    name: `${chalk.green('✔')} ${getMessage('has-git-repository')}`,
    value: ''
  }
]

const hasNoGitDirectoryPrompt = () => [
  {
    name: `${getMessage(INITIALIZE_GIT)}`,
    value: INITIALIZE_GIT
  }
]

const hasNoCommitsPrompt = choices => [
  ...choices,
  ifElse(hasCommits)(() => ({
    name: `${chalk.green('✔')} ${getMessage('no-initial-commit')}`,
    value: ''
  }))(() => ({
    name: `${getMessage('no-initial-commit')}`,
    value: INITIAL_COMMIT
  }))()
]

const hasNoGitIgnorePrompt = choices => [
  ...choices,
  ifElse(hasGitIgnore)(() => ({
    name: `${chalk.green('✔')} ${getMessage('no-git-ignore')}`,
    value: ''
  }))(() => ({
    name: `${getMessage('no-git-ignore')}`,
    value: GIT_IGNORE
  }))()
]

const donePrompt = choices => [
  ...choices,
  { name: 'Done', value: choices[0].value === '' ? DONE : ABORT }
]

const abort = pipe([
  () => console.log(`${chalk.red('abort:')}  ${getMessage('abort')}`),
  () => Promise.reject({ abort: true })
])

const createChoices = pipe([
  ifElse(isGitInstalled)(hasGitDirectoryPrompt)(hasNoGitDirectoryPrompt),
  when(isGitInstalled)(hasNoCommitsPrompt),
  when(isGitInstalled)(hasNoGitIgnorePrompt),
  donePrompt
])

const processChoices = cond([
  [isChoice(INITIALIZE_GIT), pipe([initGit, () => run()])],
  [isChoice(INITIAL_COMMIT), pipe([createInitialCommit, () => run()])],
  [isChoice(GIT_IGNORE), pipe([addGitIgnore, () => run()])],
  [isChoice(ABORT), abort],
  [isChoice(''), () => run()]
])

const run = pipe([
  createChoices,
  choices =>
    inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Git - Free and open source distribution system',
        choices,
        default: getDefaultChoice(choices)
      }
    ]),
  processChoices
])

export default run
