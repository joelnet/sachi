import chalk from 'chalk'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import when from 'mojiscript/logic/when'
import complement from 'ramda/src/complement'
import getMessage from './lib/getMessage'
import installPackages from './steps/installPackages'
import setEslintConfig from './steps/setEslintConfig'
import { readPackageJson, setPackageJson } from './steps/setPackageJson'

const hasEslint = (o = {}) => !!o.eslint
const hasPrettier = (o = {}) => !!o.prettier
const hasJest = (o = {}) => !!o.jest
const hasNoEslint = complement(hasEslint)

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

const installEslint = pipe([installPackages, setPackageJson, setEslintConfig])

const maybeInstallEslint = pipe([getState, when(hasNoEslint)(installEslint)])

export const test = pipe([
  getState,
  ifElse(hasEslint)(messageInstalled)(messageNotInstalled)
])

export default maybeInstallEslint
