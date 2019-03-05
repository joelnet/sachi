import chalk from 'chalk'
import inquirer from 'inquirer'
import pipe from 'mojiscript/core/pipe'
import cond from 'mojiscript/logic/cond'
import ifElse from 'mojiscript/logic/ifElse'
import when from 'mojiscript/logic/when'
import {
  ABORT,
  getDefaultChoice,
  GIT_IGNORE,
  INITIALIZE_GIT,
  INITIAL_COMMIT,
  NONE
} from './choices'
import getMessage from './getMessage'
import {
  donePrompt,
  hasGitDirectoryPrompt,
  hasNoCommitsPrompt,
  hasNoGitDirectoryPrompt,
  hasNoGitIgnorePrompt
} from './prompts'
import { addGitIgnore } from './steps/addGitIgnore'
import { createInitialCommit } from './steps/checkHasCommits'
import { initGit, isGitInstalled } from './steps/initGit'

const isChoice = c => ({ choice }) => choice === c

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
  [isChoice(NONE), () => run()]
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
