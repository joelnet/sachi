export const INITIALIZE_GIT = 'initialize-git'
export const INITIAL_COMMIT = 'initial-commit'
export const GIT_IGNORE = 'git-ignore'
export const DONE = 'Done'
export const ABORT = 'abort'
export const NONE = ''

export const getDefaultChoice = choices =>
  choices.find(o => o.value === INITIALIZE_GIT) ? INITIALIZE_GIT
  : choices.find(o => o.value === INITIAL_COMMIT) ? INITIAL_COMMIT
  : choices.find(o => o.value === GIT_IGNORE) ? GIT_IGNORE
  : DONE // prettier-ignore
