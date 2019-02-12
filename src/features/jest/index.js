import pipe from 'mojiscript/core/pipe'
import shell from 'shelljs'
import checkInstallStep, { testInstall } from './steps/checkInstallStep'

const jestFeature = pipe([
  () => Promise.resolve(shell.config.reset()),
  checkInstallStep
])

export default jestFeature

export const test = testInstall
