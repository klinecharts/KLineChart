import { init, registerLocale } from 'klinecharts'
import './index.less'

function genData (timestamp = new Date().getTime(), length = 800) {
  let basePrice = 5000
  timestamp = Math.floor(timestamp / 1000 / 60) * 60 * 1000 - length * 60 * 1000
  const dataList = []
  for (let i = 0; i < length; i++) {
    const prices = []
    for (let j = 0; j < 4; j++) {
      prices.push(basePrice + Math.random() * 60 - 30)
    }
    prices.sort()
    const open = +(prices[Math.round(Math.random() * 3)].toFixed(2))
    const high = +(prices[3].toFixed(2))
    const low = +(prices[0].toFixed(2))
    const close = +(prices[Math.round(Math.random() * 3)].toFixed(2))
    const volume = Math.round(Math.random() * 100) + 10
    const turnover = (open + high + low + close) / 4 * volume
    dataList.push({ timestamp, open, high,low, close, volume, turnover })

    basePrice = close
    timestamp += 60 * 1000
  }
  return dataList
}

registerLocale('zh-HK', {
  time: '時間：',
  open: '開：',
  high: '高：',
  low: '低：',
  close: '收：',
  volume: '成交量：'
})

const chart = init('k-line-chart')
chart.applyNewData(genData())

function setLang (lang) {
  chart.setLocale(lang)
}

// 以下仅仅是为了协助代码演示，在实际项目中根据情况进行调整。
// The following is only for the purpose of assisting in code demonstration, and adjustments will be made according to the actual situation in the project.
const container = document.getElementById('container')
const buttonContainer = document.createElement('div')
buttonContainer.className = 'button-container'
const items = [
  { key: 'zh-CN', text: '简体中文' },
  { key: 'zh-HK', text: '繁体中文' },
  { key: 'en-US', text: 'English' }
]
items.forEach(({ key, text }) => {
  const button = document.createElement('button')
  button.innerText = text
  button.addEventListener('click', () => { setLang(key) })
  buttonContainer.appendChild(button)
})
container.appendChild(buttonContainer)
