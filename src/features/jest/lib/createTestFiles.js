import fs from 'fs-extra'
import pipe from 'mojiscript/core/pipe'
import ifElse from 'mojiscript/logic/ifElse'
import { join } from 'path'

const testFolder = join(process.cwd(), 'src/__tests__')
const testFilePath = join(process.cwd(), 'src/__tests__/index.test.js')

const testFile = `describe('index', () => {
  test.skip('TODO: create test', () => {
  })
})
`

const testFileExists = () => fs.existsSync(testFilePath)
const writeTestFile = () => fs.writeFile(testFilePath, testFile)

const createTestFiles = pipe([
  () => fs.ensureDir(testFolder),
  ifElse(testFileExists)(() => null)(writeTestFile)
])

export default createTestFiles
