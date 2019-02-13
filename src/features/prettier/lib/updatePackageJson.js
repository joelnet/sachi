import pipe from 'mojiscript/core/pipe'
import { join } from 'path'
import fs from 'fs-extra'

const fullPath = join(process.cwd(), 'package.json')

export const readPackageJson = pipe([
  () => fs.readFile(fullPath, 'utf8'),
  text => JSON.parse(text)
])
