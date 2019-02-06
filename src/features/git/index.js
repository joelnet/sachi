import pipe from 'mojiscript/core/pipe'
import shell from 'shelljs'
import checkHasCommits from './steps/checkHasCommits'
import checkInstallStep from './steps/checkInstallStep'

const gitFeature = pipe([
  () => shell.config.reset(),
  checkInstallStep,
  checkHasCommits
])

export default gitFeature
