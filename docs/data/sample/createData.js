import fs from 'fs'
import path from 'path'

const includeFileNames = ['index.js', 'index.html', 'index.css']

function createData () {
  const root = path.join(path.resolve(), 'data', 'sample')
  const dirs = fs.readdirSync(root)
  dirs.forEach(dir => {
    const samplePath = path.join(root, dir)
    if (fs.statSync(samplePath).isDirectory()) {
      const fileNames = fs.readdirSync(samplePath)
      const result = {}
      fileNames.forEach(name => {
        if (includeFileNames.includes(name)) {
          result[name] = fs.readFileSync(path.join(samplePath, name), 'utf-8')
        }
      })
      fs.writeFileSync(path.join(samplePath, 'index.json'), JSON.stringify(result), 'utf-8')
    }
  })
}

createData()
