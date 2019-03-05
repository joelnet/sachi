import fs from 'fs-extra'
import pipe from 'mojiscript/core/pipe'
import { join } from 'path'

const nodeGitIgnore = join(__dirname, '../data/Node.gitignore')

export const hasGitIgnore = () => fs.existsSync('.gitignore')

export const addGitIgnore = pipe([
  () => fs.readFile(nodeGitIgnore, 'utf8'),
  data => fs.writeFile('.gitignore', data)
])
