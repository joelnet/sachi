import chalk from 'chalk'
import ifElse from 'mojiscript/logic/ifElse'
import {
  ABORT,
  DONE,
  GIT_IGNORE,
  INITIALIZE_GIT,
  INITIAL_COMMIT
} from './choices'
import getMessage from './getMessage'
import { hasGitIgnore } from './steps/addGitIgnore'
import { hasCommits } from './steps/checkHasCommits'

export const hasGitDirectoryPrompt = () => [
  {
    name: `${chalk.green('✔')} ${getMessage('has-git-repository')}`,
    value: ''
  }
]

export const hasNoGitDirectoryPrompt = () => [
  {
    name: `${getMessage(INITIALIZE_GIT)}`,
    value: INITIALIZE_GIT
  }
]

export const hasNoCommitsPrompt = choices => [
  ...choices,
  ifElse(hasCommits)(() => ({
    name: `${chalk.green('✔')} ${getMessage('no-initial-commit')}`,
    value: ''
  }))(() => ({
    name: `${getMessage('no-initial-commit')}`,
    value: INITIAL_COMMIT
  }))()
]

export const hasNoGitIgnorePrompt = choices => [
  ...choices,
  ifElse(hasGitIgnore)(() => ({
    name: `${chalk.green('✔')} ${getMessage('no-git-ignore')}`,
    value: ''
  }))(() => ({
    name: `${getMessage('no-git-ignore')}`,
    value: GIT_IGNORE
  }))()
]

export const donePrompt = choices => [
  ...choices,
  { name: 'Done', value: choices[0].value === '' ? DONE : ABORT }
]
