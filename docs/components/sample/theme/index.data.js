import fs from 'fs'

export default {
  watch: ['./index.js', './index.css', './index.html'],
  load (watchedFiles) {
    return watchedFiles.reduce((data, file) => {
      const result = fs.readFileSync(file, 'utf-8')
      let key
      if (file.match('index.js')) {
        key = 'js'
      } else if (file.match('index.css')) {
        key = 'css'
      } else {
        key = 'html'
      }
      data[key] = result
      return data
    }, {})
  }
}