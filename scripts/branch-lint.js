import childProcess from 'child_process'
import chalk from 'chalk'

const branchName = childProcess.execSync('git branch --show-current').toString().trim()
if (!(/^(feature|fix)\/[A-Za-z0-9]+([-][A-Za-z0-9]+)*$/.test(branchName))) {
  console.log(
    chalk.red('Error: branch ') +
    chalk.underline.red(branchName) +
    chalk.red(' not in compliance with the specification, branch names must start with feature/ or fix/ and may only contain letters, numbers, and the character \'-\'')
  )
  process.exit(1)
}
