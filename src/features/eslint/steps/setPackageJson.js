import fs from 'fs-extra'
import pipe from 'mojiscript/core/pipe'
import tap from 'mojiscript/function/tap'
import { join } from 'path'

const filePath = join(process.cwd(), 'package.json')

export const readPackageJson = pipe([
  () => fs.readFile(filePath, 'utf8'),
  last => JSON.parse(last)
])

const writePackageJson = pipe([
  json => JSON.stringify(json, null, 2),
  text => fs.writeFile(filePath, text)
])

const setPackageJsonScripts = json => ({
  ...json,
  scripts: {
    ...(json.scripts || {}),
    lint: (json.scripts || {}).lint || 'eslint .'
  }
})

export const setPackageJson = tap(
  pipe([readPackageJson, setPackageJsonScripts, writePackageJson])
)
