import { init, registerStyles } from 'klinecharts'
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

const red = '#F92855'
const green = '#2DC08E'

const alphaRed = 'rgba(249, 40, 85, .7)'
const alphaGreen = 'rgba(45, 192, 142, .7)'

registerStyles('green_rise_red_fall', {
  candle: {
    bar: {
      upColor: green,
      downColor: red,
      upBorderColor: green,
      downBorderColor: red,
      upWickColor: green,
      downWickColor: red
    },
    priceMark: {
      last: {
        upColor: green,
        downColor: red
      }
    }
  },
  indicator: {
    ohlc: {
      upColor: alphaGreen,
      downColor: alphaRed
    },
    bars: [{
      style: 'fill',
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaGreen,
      downColor: alphaRed,
      noChangeColor: '#888888'
    }],
    circles: [{
      style: 'fill',
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaGreen,
      downColor: alphaRed,
      noChangeColor: '#888888'
    }]
  }
})

registerStyles('red_rise_green_fall', {
  candle: {
    bar: {
      upColor: red,
      downColor: green,
      upBorderColor: red,
      downBorderColor: green,
      upWickColor: red,
      downWickColor: green,
    },
    priceMark: {
      last: {
        upColor: red,
        downColor: green,
      }
    }
  },
  indicator: {
    ohlc: {
      upColor: alphaRed,
      downColor: alphaGreen
    },
    bars: [{
      style: 'fill',
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaRed,
      downColor: alphaGreen,
      noChangeColor: '#888888'
    }],
    circles: [{
      style: 'fill',
      borderStyle: 'solid',
      borderSize: 1,
      borderDashedValue: [2, 2],
      upColor: alphaRed,
      downColor: alphaGreen,
      noChangeColor: '#888888'
    }]
  }
})

const chart = init('k-line-chart')
chart.createIndicator('VOL')
chart.applyNewData(genData())

function setTheme (theme) {
  chart.setStyles(theme)
  if (theme === 'light') {
    document.getElementById('k-line-chart').style.backgroundColor = '#ffffff'
  } else if (theme === 'dark') {
    document.getElementById('k-line-chart').style.backgroundColor = '#1b1b1f'
  }
}

// 以下仅仅是为了协助代码演示，在实际项目中根据情况进行调整。
// The following is only for the purpose of assisting in code demonstration, and adjustments will be made according to the actual situation in the project.
const container = document.getElementById('container')
const buttonContainer = document.createElement('div')
buttonContainer.className = 'button-container'
const items = [
  { key: 'light', text: '浅色-Light' },
  { key: 'dark', text: '深色-Dark' },
  { key: 'green_rise_red_fall', text: '绿涨红跌-Green rise and red fall' },
  { key: 'red_rise_green_fall', text: '红涨绿跌-Red rise and green fall' }
]
items.forEach(({ key, text }) => {
  const button = document.createElement('button')
  button.innerText = text
  button.addEventListener('click', () => { setTheme(key) })
  buttonContainer.appendChild(button)
})
container.appendChild(buttonContainer)