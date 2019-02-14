import chalk from 'chalk'
import child_process from 'child_process'
import I from 'mojiscript/combinators/I'
import W from 'mojiscript/combinators/W'
import pipe from 'mojiscript/core/pipe'
import tap from 'mojiscript/function/tap'
import ifElse from 'mojiscript/logic/ifElse'
import getMessage from './lib/getMessage'
import setEslintConfig from './lib/setEslintConfig'
import { readPackageJson, updatePackageJson } from './lib/updatePackageJson'
import when from 'mojiscript/logic/when'

const hasEslint = (o = {}) => !!o.eslint
const hasPrettier = (o = {}) => !!o.prettier
const hasJest = (o = {}) => !!o.jest

const getState = pipe([
  readPackageJson,
  ({ devDependencies }) => ({
    eslint: hasEslint(devDependencies),
    jest: hasJest(devDependencies),
    prettier: hasPrettier(devDependencies)
  })
])

const messageInstalled = () =>
  `${chalk.green('✔')} ${getMessage('description')}`

const messageNotInstalled = () =>
  `${chalk.yellow('⚠️')} ${getMessage('description')}`

const npmInstall = packageName =>
  child_process.execFileSync('npm', ['install', packageName, '--save-dev'], {
    stdio: 'inherit'
  })

const ifDoesNotHaveEslint = ifElse(hasEslint)(I)

const installEslint = W(state =>
  pipe([
    tap(() => npmInstall(getMessage('eslint'))),
    when(() => state.prettier)(
      tap(() => npmInstall(getMessage('eslint-plugin-prettier')))
    ),
    tap(updatePackageJson),
    tap(setEslintConfig)
  ])
)

const maybeInstallEslint = pipe([getState, ifDoesNotHaveEslint(installEslint)])

export const test = pipe([
  getState,
  ifElse(hasEslint)(messageInstalled)(messageNotInstalled)
])

export default maybeInstallEslint
