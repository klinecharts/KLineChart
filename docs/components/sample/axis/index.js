const js = `
import { init } from 'klinecharts'
import './index.css'

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

const chart = init('k-line-chart')
chart.applyNewData(genData())

function setPosition (position) {
  chart.setStyles({
    yAxis: {
      position
    }
  })
}

function setInside (inside) {
  chart.setStyles({
    yAxis: {
      inside
    }
  })
}

function setType (type) {
  chart.setStyles({
    yAxis: {
      type
    }
  })
}

function setReverse (reverse) {
  chart.setStyles({
    yAxis: {
      reverse
    }
  })
}


// 添加演示代码
const container = document.getElementById('container')
const buttonContainer = document.createElement('div')
buttonContainer.className = 'button-container'

const positions = [
  { key: 'right', text: '右侧' },
  { key: 'left', text: '左侧' }
]
const insideOutside = [
  { key: true, text: '外部' },
  { key: false, text: '外部' }
]
const types = [
  { key: 'normal', text: '线性轴' },
  { key: 'percentage', text: '百分比轴' },
  { key: 'log', text: '对数轴' },
]
const reverse = [
  { key: false, text: '正向' },
  { key: true, text: '反向' }
]
positions.forEach(({ key, text }) => {
  const button = document.createElement('button')
  button.innerText = text
  button.addEventListener('click', () => { setPosition(key) })
  buttonContainer.appendChild(button)
})
insideOutside.forEach(({ key, text }) => {
  const button = document.createElement('button')
  button.innerText = text
  button.addEventListener('click', () => { setInside(key) })
  buttonContainer.appendChild(button)
})
types.forEach(({ key, text }) => {
  const button = document.createElement('button')
  button.innerText = text
  button.addEventListener('click', () => { setType(key) })
  buttonContainer.appendChild(button)
})
reverse.forEach(({ key, text }) => {
  const button = document.createElement('button')
  button.innerText = text
  button.addEventListener('click', () => { setReverse(key) })
  buttonContainer.appendChild(button)
})
container.appendChild(buttonContainer)
`

const css = `
.button-container {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding: 10px 22px;
}

.button-container button {
  padding: 2px 6px;
  background-color: #1677FF;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
  outline: none;
  border: none;
}
`

const html = `
<div id="container">
  <div id="k-line-chart" style="height:430px">
</div>
`

export { js, css, html }