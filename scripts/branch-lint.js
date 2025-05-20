import childProcess from 'child_process'
import { styleText } from 'node:util'

const branchName = childProcess.execSync('git branch --show-current').toString().trim()
if (!(/^(feature|fix)\/[A-Za-z0-9]+([-][A-Za-z0-9]+)*$/.test(branchName))) {
  console.log(
    styleText('red', 'Error: branch ') +
    styleText(['underline', 'red'], branchName) +
    styleText('red', ' not in compliance with the specification, branch names must start with feature/ or fix/ and may only contain letters, numbers, and the character \'-\'')
  )
  process.exit(1)
}
