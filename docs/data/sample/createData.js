import fs from 'fs'
import path from 'path'

function createData (dir) {
  const fileNames = fs.readdirSync(dir)
  const result = {}
  fileNames.forEach(name => {
    const fullPath = path.join(dir, name)
    if (fs.statSync(fullPath).isDirectory()) {
      result[name] = createData(fullPath)
    } else {
      if (name !== 'index.data.js' && name !== 'index.md') {
        result[name] = fs.readFileSync(fullPath, 'utf-8') 
      }
    }
  })
  return result
}

export default createData
