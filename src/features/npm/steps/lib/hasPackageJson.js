import fs from 'fs-extra'
import { join } from 'path'

const fullPath = join(process.cwd(), 'package.json')
const hasPackageJson = () => fs.pathExistsSync(fullPath)

export default hasPackageJson
