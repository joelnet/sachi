import { execFileSync } from 'child_process'
import pipe from 'mojiscript/core/pipe'
import tap from 'mojiscript/function/tap'
import when from 'mojiscript/logic/when'
import getMessage from '../lib/getMessage'

const npmInstall = packageName =>
  execFileSync('npm', ['install', packageName, '--save-dev'], {
    stdio: 'inherit'
  })

const hasPrettier = state => state.prettier

const installEslint = () => npmInstall(getMessage('eslint'))
const installPlugins = pipe([
  () => npmInstall(getMessage('eslint-plugin-prettier')),
  () => npmInstall(getMessage('eslint-config-prettier'))
])

const installPackages = pipe([
  tap(installEslint),
  when(hasPrettier)(tap(installPlugins))
])

export default installPackages
