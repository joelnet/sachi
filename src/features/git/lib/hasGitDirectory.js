import fs from 'fs-extra'
import { join } from 'path'

const fullPath = join(process.cwd(), '.git')
const hasGitDirectory = () => fs.pathExistsSync(fullPath)

export default hasGitDirectory
