import pipe from 'mojiscript/core/pipe'
import shell from 'shelljs'
import checkInstallStep from './steps/checkInstallStep'

const npmFeature = pipe([() => shell.config.reset(), checkInstallStep])

export default npmFeature
